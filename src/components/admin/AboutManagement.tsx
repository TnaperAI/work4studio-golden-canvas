import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Edit, Trash2, Users, Building } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  skills: string[];
  experience: string;
  is_active: boolean;
  sort_order: number;
}

interface CompanyInfo {
  id: string;
  mission: string;
  vision: string;
  founding_year: string;
  team_size: string;
  projects_completed: string;
  clients_served: string;
  description: string;
}

const AboutManagement = () => {
  const { toast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [uploading, setUploading] = useState(false);

  const emptyTeamMember: Omit<TeamMember, 'id'> = {
    name: '',
    position: '',
    description: '',
    image: '',
    skills: [],
    experience: '',
    is_active: true,
    sort_order: 0
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch team members
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order');

      if (teamError) throw teamError;

      // Fetch company info
      const { data: companyData, error: companyError } = await supabase
        .from('company_info')
        .select('*')
        .maybeSingle();

      if (companyError) throw companyError;

      setTeam(teamData || []);
      setCompanyInfo(companyData);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCompanyInfo = async () => {
    if (!companyInfo) return;

    try {
      const { error } = await supabase
        .from('company_info')
        .upsert(companyInfo, { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Информация о компании обновлена',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить данные',
        variant: 'destructive',
      });
    }
  };

  const saveTeamMember = async () => {
    if (!editingTeamMember) return;

    try {
      if (editingTeamMember.id) {
        // Update existing
        const { error } = await supabase
          .from('team_members')
          .update(editingTeamMember)
          .eq('id', editingTeamMember.id);
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('team_members')
          .insert(editingTeamMember);
        if (error) throw error;
      }

      toast({
        title: 'Успешно',
        description: editingTeamMember.id ? 'Участник команды обновлен' : 'Участник команды добавлен',
      });

      fetchData();
      setEditingTeamMember(null);
      setShowTeamForm(false);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить участника команды',
        variant: 'destructive',
      });
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Участник команды удален',
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить участника команды',
        variant: 'destructive',
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && editingTeamMember) {
      setEditingTeamMember({
        ...editingTeamMember,
        skills: [...editingTeamMember.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    if (editingTeamMember) {
      setEditingTeamMember({
        ...editingTeamMember,
        skills: editingTeamMember.skills.filter((_, i) => i !== index)
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingTeamMember) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      toast({
        title: 'Ошибка',
        description: 'Поддерживаются только файлы JPEG и PNG',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Ошибка',
        description: 'Размер файла не должен превышать 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `team/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('team-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('team-images')
        .getPublicUrl(filePath);

      // Update team member with new image URL
      setEditingTeamMember({
        ...editingTeamMember,
        image: publicUrl
      });

      toast({
        title: 'Успешно',
        description: 'Изображение загружено',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить изображение',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Building className="h-8 w-8" />
            Управление страницей "О нас"
          </h1>
          <p className="text-muted-foreground">
            Редактирование информации о компании и команде
          </p>
        </div>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Информация о компании</TabsTrigger>
          <TabsTrigger value="team">Команда</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {companyInfo && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Описание компании</Label>
                      <Textarea
                        value={companyInfo.description || ''}
                        onChange={(e) => setCompanyInfo({
                          ...companyInfo,
                          description: e.target.value
                        })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Миссия</Label>
                      <Textarea
                        value={companyInfo.mission || ''}
                        onChange={(e) => setCompanyInfo({
                          ...companyInfo,
                          mission: e.target.value
                        })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Видение</Label>
                      <Textarea
                        value={companyInfo.vision || ''}
                        onChange={(e) => setCompanyInfo({
                          ...companyInfo,
                          vision: e.target.value
                        })}
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Год основания</Label>
                      <Input
                        value={companyInfo.founding_year || ''}
                        onChange={(e) => setCompanyInfo({
                          ...companyInfo,
                          founding_year: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Размер команды</Label>
                      <Input
                        value={companyInfo.team_size || ''}
                        onChange={(e) => setCompanyInfo({
                          ...companyInfo,
                          team_size: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Проектов завершено</Label>
                      <Input
                        value={companyInfo.projects_completed || ''}
                        onChange={(e) => setCompanyInfo({
                          ...companyInfo,
                          projects_completed: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Клиентов обслужено</Label>
                      <Input
                        value={companyInfo.clients_served || ''}
                        onChange={(e) => setCompanyInfo({
                          ...companyInfo,
                          clients_served: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <Button onClick={saveCompanyInfo}>
                    Сохранить информацию о компании
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Команда ({team.length})
            </h2>
            <Button 
              onClick={() => {
                setEditingTeamMember({ ...emptyTeamMember, id: '' });
                setShowTeamForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить участника
            </Button>
          </div>

          <div className="grid gap-4">
            {team.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-primary">{member.position}</p>
                          <p className="text-sm text-muted-foreground mt-1">{member.experience}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={member.is_active}
                            onCheckedChange={async (checked) => {
                              const { error } = await supabase
                                .from('team_members')
                                .update({ is_active: checked })
                                .eq('id', member.id);
                              
                              if (!error) {
                                fetchData();
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingTeamMember(member);
                              setShowTeamForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTeamMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mt-2">{member.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Team Member Form Modal */}
          {showTeamForm && editingTeamMember && (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>
                  {editingTeamMember.id ? 'Редактировать' : 'Добавить'} участника команды
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Имя *</Label>
                    <Input
                      value={editingTeamMember.name}
                      onChange={(e) => setEditingTeamMember({
                        ...editingTeamMember,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Должность *</Label>
                    <Input
                      value={editingTeamMember.position}
                      onChange={(e) => setEditingTeamMember({
                        ...editingTeamMember,
                        position: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Опыт</Label>
                    <Input
                      value={editingTeamMember.experience}
                      onChange={(e) => setEditingTeamMember({
                        ...editingTeamMember,
                        experience: e.target.value
                      })}
                      placeholder="5+ лет"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Порядок сортировки</Label>
                    <Input
                      type="number"
                      value={editingTeamMember.sort_order}
                      onChange={(e) => setEditingTeamMember({
                        ...editingTeamMember,
                        sort_order: Number(e.target.value)
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Изображение</Label>
                  <div className="space-y-2">
                    {editingTeamMember.image && (
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <img 
                          src={editingTeamMember.image} 
                          alt="Предпросмотр" 
                          className="w-16 h-16 object-cover rounded"
                        />
                        <span className="text-sm text-muted-foreground">Текущее изображение</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTeamMember({
                            ...editingTeamMember,
                            image: ''
                          })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Загрузка изображения...
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea
                    value={editingTeamMember.description}
                    onChange={(e) => setEditingTeamMember({
                      ...editingTeamMember,
                      description: e.target.value
                    })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Навыки</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Добавить навык..."
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button type="button" onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editingTeamMember.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button onClick={() => removeSkill(index)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingTeamMember.is_active}
                    onCheckedChange={(checked) => setEditingTeamMember({
                      ...editingTeamMember,
                      is_active: checked
                    })}
                  />
                  <Label>Активный участник</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowTeamForm(false);
                      setEditingTeamMember(null);
                    }}
                  >
                    Отмена
                  </Button>
                  <Button onClick={saveTeamMember}>
                    Сохранить
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutManagement;