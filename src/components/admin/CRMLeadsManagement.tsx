import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Building2, Mail, Phone, MapPin, Calendar, Plus, Search, Filter, Download, Play } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ParsedCompany {
  id: string;
  company_name: string;
  company_type: string;
  registration_number?: string;
  country: string;
  region?: string;
  city?: string;
  address?: string;
  registration_date?: string;
  email?: string;
  phone?: string;
  website?: string;
  status: string;
  industry?: string;
  notes?: string;
  source_url?: string;
  parsed_at: string;
  updated_at: string;
}

const statusLabels = {
  new: 'Новый',
  contacted: 'Связались',
  proposal_sent: 'КП отправлено',
  in_negotiation: 'Переговоры',
  closed_won: 'Закрыто (выиграно)',
  closed_lost: 'Закрыто (проиграно)',
  not_interested: 'Не заинтересован'
};

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  proposal_sent: 'bg-purple-100 text-purple-800',
  in_negotiation: 'bg-orange-100 text-orange-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-red-100 text-red-800',
  not_interested: 'bg-gray-100 text-gray-800'
};

const CRMLeadsManagement = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<ParsedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState<ParsedCompany | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isParsingLoading, setIsParsingLoading] = useState(false);

  const fetchCompanies = async () => {
    try {
      let query = supabase
        .from('parsed_companies')
        .select('*')
        .order('parsed_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      if (countryFilter !== 'all') {
        query = query.eq('country', countryFilter as any);
      }

      if (searchTerm) {
        query = query.ilike('company_name', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные компаний',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyStatus = async (companyId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('parsed_companies')
        .update({ status: newStatus as any })
        .eq('id', companyId);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Статус компании обновлен',
      });

      fetchCompanies();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    }
  };

  const updateCompanyNotes = async (companyId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('parsed_companies')
        .update({ notes })
        .eq('id', companyId);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Заметки обновлены',
      });

      fetchCompanies();
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить заметки',
        variant: 'destructive',
      });
    }
  };

  const startParsing = async () => {
    setIsParsingLoading(true);
    try {
      console.log('Starting Russian companies parsing...');
      
      const { data, error } = await supabase.functions.invoke('parse-russia-companies');
      
      if (error) throw error;
      
      const result = data;
      
      toast({
        title: 'Парсинг завершен!',
        description: `Найдено компаний: ${result.companies_found}, сохранено: ${result.companies_saved}`,
      });
      
      // Обновляем список компаний
      await fetchCompanies();
      
    } catch (error) {
      console.error('Error during parsing:', error);
      toast({
        title: 'Ошибка парсинга',
        description: 'Не удалось запустить парсинг компаний',
        variant: 'destructive',
      });
    } finally {
      setIsParsingLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [searchTerm, statusFilter, countryFilter]);

  const stats = {
    total: companies.length,
    new: companies.filter(c => c.status === 'new').length,
    contacted: companies.filter(c => c.status === 'contacted').length,
    proposalSent: companies.filter(c => c.status === 'proposal_sent').length,
    won: companies.filter(c => c.status === 'closed_won').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">CRM - Управление лидами</h1>
        <div className="flex space-x-3">
          <Button 
            onClick={startParsing}
            disabled={isParsingLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isParsingLoading ? (
              <>
                <Download className="mr-2 h-4 w-4 animate-spin" />
                Парсинг...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Запустить парсинг РФ
              </>
            )}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить компанию
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Всего компаний</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <div className="text-sm text-muted-foreground">Новые</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.contacted}</div>
            <div className="text-sm text-muted-foreground">Связались</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.proposalSent}</div>
            <div className="text-sm text-muted-foreground">КП отправлено</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.won}</div>
            <div className="text-sm text-muted-foreground">Выиграно</div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию компании..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Страна" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все страны</SelectItem>
                <SelectItem value="by">Беларусь</SelectItem>
                <SelectItem value="ru">Россия</SelectItem>
                <SelectItem value="kz">Казахстан</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Таблица компаний */}
      <Card>
        <CardHeader>
          <CardTitle>Список компаний</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Компания</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Локация</TableHead>
                <TableHead>Контакты</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Источник</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Компании не найдены
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{company.company_name}</div>
                          {company.industry && (
                            <div className="text-sm text-muted-foreground">{company.industry}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{company.company_type.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {[company.city, company.region, company.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {company.email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-3 w-3" />
                            <span>{company.email}</span>
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{company.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={company.status}
                        onValueChange={(value) => updateCompanyStatus(company.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <Badge className={statusColors[company.status as keyof typeof statusColors]}>
                            {statusLabels[company.status as keyof typeof statusLabels]}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={company.source_url === 'dadata.ru' ? 'default' : 'secondary'}>
                        {company.source_url === 'dadata.ru' ? '🎯 DaData' : company.source_url === 'demo-data' ? '⚠️ Демо' : company.source_url || 'Неизвестно'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {company.registration_date ? (
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(new Date(company.registration_date), 'dd.MM.yyyy', { locale: ru })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Подробнее
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{company.company_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Тип компании</label>
                                <div className="text-sm text-muted-foreground">{company.company_type}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Регистрационный номер</label>
                                <div className="text-sm text-muted-foreground">{company.registration_number || '—'}</div>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Полный адрес</label>
                              <div className="text-sm text-muted-foreground">{company.address || '—'}</div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Заметки</label>
                              <Textarea
                                placeholder="Добавить заметки..."
                                value={company.notes || ''}
                                onChange={(e) => {
                                  const updatedCompanies = companies.map(c => 
                                    c.id === company.id ? { ...c, notes: e.target.value } : c
                                  );
                                  setCompanies(updatedCompanies);
                                }}
                                onBlur={(e) => updateCompanyNotes(company.id, e.target.value)}
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMLeadsManagement;