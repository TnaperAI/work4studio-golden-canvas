import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Users,
  Clock,
  ChevronUp,
  ChevronDown,
  Globe,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string | null;
  image: string | null;
  skills: string[] | null;
  experience: string | null;
  is_active: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

interface TeamMemberTranslation {
  id: string;
  team_member_id: string;
  language: string;
  name: string;
  position: string;
  description: string | null;
}

const TeamManagement = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [translations, setTranslations] = useState<{[key: string]: TeamMemberTranslation[]}>({});
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'ru' | 'en'>('ru');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    ru: {
      name: '',
      position: '',
      description: ''
    },
    en: {
      name: '',
      position: '',
      description: ''
    },
    image: '',
    skills: '',
    experience: '',
    is_active: true,
    sort_order: 0
  });
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    fetchMembers();
    fetchTranslations();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список команды',
        variant: 'destructive'
      });
    }
  };

  const fetchTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('team_member_translations')
        .select('*');

      if (error) throw error;
      
      const translationsByMember: {[key: string]: TeamMemberTranslation[]} = {};
      data?.forEach(translation => {
        if (!translationsByMember[translation.team_member_id]) {
          translationsByMember[translation.team_member_id] = [];
        }
        translationsByMember[translation.team_member_id].push(translation);
      });
      
      setTranslations(translationsByMember);
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [];
      
      const memberData = {
        name: formData.ru.name, // Используем русское имя как основное
        position: formData.ru.position,
        description: formData.ru.description || null,
        image: formData.image || null,
        skills: skillsArray.length > 0 ? skillsArray : null,
        experience: formData.experience || null,
        is_active: formData.is_active,
        sort_order: formData.sort_order
      };

      let memberId: string;

      if (editingMember) {
        const { error } = await supabase
          .from('team_members')
          .update(memberData)
          .eq('id', editingMember.id);

        if (error) throw error;
        memberId = editingMember.id;
      } else {
        const { data, error } = await supabase
          .from('team_members')
          .insert([memberData])
          .select()
          .single();

        if (error) throw error;
        memberId = data.id;
      }

      // Сохраняем переводы
      for (const lang of ['ru', 'en']) {
        const translationData = {
          team_member_id: memberId,
          language: lang,
          name: formData[lang as 'ru' | 'en'].name,
          position: formData[lang as 'ru' | 'en'].position,
          description: formData[lang as 'ru' | 'en'].description || null
        };

        const { error: upsertError } = await supabase
          .from('team_member_translations')
          .upsert(translationData, { 
            onConflict: 'team_member_id,language',
            ignoreDuplicates: false 
          });

        if (upsertError) throw upsertError;
      }

      toast({
        title: editingMember ? 'Участник обновлен' : 'Участник добавлен',
        description: 'Информация о члене команды успешно сохранена'
      });

      resetForm();
      fetchMembers();
      fetchTranslations();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить данные',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = async (member: TeamMember) => {
    setEditingMember(member);
    
    // Загружаем переводы для редактируемого участника
    const memberTranslations = translations[member.id] || [];
    const ruTranslation = memberTranslations.find(t => t.language === 'ru');
    const enTranslation = memberTranslations.find(t => t.language === 'en');
    
    setFormData({
      ru: {
        name: ruTranslation?.name || member.name,
        position: ruTranslation?.position || member.position,
        description: ruTranslation?.description || member.description || ''
      },
      en: {
        name: enTranslation?.name || '',
        position: enTranslation?.position || '',
        description: enTranslation?.description || ''
      },
      image: member.image || '',
      skills: member.skills ? member.skills.join(', ') : '',
      experience: member.experience || '',
      is_active: member.is_active,
      sort_order: member.sort_order || 0
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого члена команды?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Участник удален',
        description: 'Член команды был успешно удален'
      });
      
      fetchMembers();
      fetchTranslations();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить участника',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      ru: {
        name: '',
        position: '',
        description: ''
      },
      en: {
        name: '',
        position: '',
        description: ''
      },
      image: '',
      skills: '',
      experience: '',
      is_active: true,
      sort_order: 0
    });
    setEditingMember(null);
    setIsCreating(false);
    setActiveLanguage('ru');
  };

  const updateSortOrder = async (id: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ sort_order: newOrder })
        .eq('id', id);

      if (error) throw error;
      fetchMembers();
    } catch (error) {
      console.error('Error updating sort order:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `team/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('team-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('team-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      
      toast({
        title: 'Изображение загружено',
        description: 'Фотография успешно загружена'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить изображение',
        variant: 'destructive'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const getDisplayName = (member: TeamMember) => {
    const memberTranslations = translations[member.id] || [];
    const currentTranslation = memberTranslations.find(t => t.language === language);
    return currentTranslation?.name || member.name;
  };

  const getDisplayPosition = (member: TeamMember) => {
    const memberTranslations = translations[member.id] || [];
    const currentTranslation = memberTranslations.find(t => t.language === language);
    return currentTranslation?.position || member.position;
  };

  const getDisplayDescription = (member: TeamMember) => {
    const memberTranslations = translations[member.id] || [];
    const currentTranslation = memberTranslations.find(t => t.language === language);
    return currentTranslation?.description || member.description;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загружаем команду...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
            <Users className="h-8 w-8" />
            Управление командой
          </h1>
          <p className="text-muted-foreground">
            Добавляйте и редактируйте информацию о членах команды на русском и английском языках
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsCreating(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить участника
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {editingMember ? 'Редактировать участника' : 'Добавить нового участника'}
              </DialogTitle>
              <DialogDescription>
                Заполните информацию о члене команды на русском и английском языках
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'ru' | 'en')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
                  <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
                </TabsList>

                <TabsContent value="ru" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-ru">Имя *</Label>
                      <Input
                        id="name-ru"
                        value={formData.ru.name}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          ru: { ...prev.ru, name: e.target.value }
                        }))}
                        required
                        placeholder="Введите имя на русском"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position-ru">Должность *</Label>
                      <Input
                        id="position-ru"
                        value={formData.ru.position}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          ru: { ...prev.ru, position: e.target.value }
                        }))}
                        required
                        placeholder="Введите должность на русском"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description-ru">Описание</Label>
                    <Textarea
                      id="description-ru"
                      value={formData.ru.description}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        ru: { ...prev.ru, description: e.target.value }
                      }))}
                      rows={3}
                      placeholder="Краткое описание на русском языке"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-en">Name *</Label>
                      <Input
                        id="name-en"
                        value={formData.en.name}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          en: { ...prev.en, name: e.target.value }
                        }))}
                        required
                        placeholder="Enter name in English"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position-en">Position *</Label>
                      <Input
                        id="position-en"
                        value={formData.en.position}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          en: { ...prev.en, position: e.target.value }
                        }))}
                        required
                        placeholder="Enter position in English"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description-en">Description</Label>
                    <Textarea
                      id="description-en"
                      value={formData.en.description}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        en: { ...prev.en, description: e.target.value }
                      }))}
                      rows={3}
                      placeholder="Brief description in English"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium">Общая информация</h3>
                
                <div className="space-y-4">
                  <Label>Фотография</Label>
                  
                  {formData.image && (
                    <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-muted/50">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Текущее изображение</p>
                        <p className="text-xs text-muted-foreground">Загрузите новое изображение для замены</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Загрузить файл</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          disabled={uploadingImage}
                          className="cursor-pointer"
                        />
                        {uploadingImage && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="image-url">или введите URL</Label>
                      <Input
                        id="image-url"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        disabled={uploadingImage}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Навыки</Label>
                    <Input
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                      placeholder="React, TypeScript, Node.js (через запятую)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Опыт работы</Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="5+ лет"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Активный участник</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sort_order">Порядок сортировки</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingMember ? 'Обновить' : 'Добавить'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {members.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Команда пуста</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Добавьте первого участника команды, чтобы начать работу
              </p>
              <Button onClick={() => {
                resetForm();
                setIsCreating(true);
              }} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Добавить участника
              </Button>
            </CardContent>
          </Card>
        ) : (
          members.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={getDisplayName(member)}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getDisplayName(member)}
                        {!member.is_active && (
                          <Badge variant="secondary">Неактивен</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {getDisplayPosition(member)}
                      </CardDescription>
                      {member.experience && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs text-muted-foreground">{member.experience}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateSortOrder(member.id, (member.sort_order || 0) - 1)}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateSortOrder(member.id, (member.sort_order || 0) + 1)}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {getDisplayDescription(member) && (
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {getDisplayDescription(member)}
                  </p>
                )}
                
                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground">
                  <span>Порядок: {member.sort_order || 0}</span>
                  <span>Добавлен: {new Date(member.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamManagement;