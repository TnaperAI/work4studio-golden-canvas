import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Target, Send, Eye, BarChart3, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Campaign {
  id: string;
  company_id: string;
  template_id: string;
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  replied_at?: string;
  status: string;
  error_message?: string;
  created_at: string;
  parsed_companies: {
    company_name: string;
    email?: string;
    country: string;
    status: string;
  };
  email_templates: {
    name: string;
    subject: string;
  };
}

const statusLabels = {
  draft: 'Черновик',
  sent: 'Отправлено',
  delivered: 'Доставлено',
  opened: 'Открыто',
  clicked: 'Кликнуто',
  replied: 'Отвечено',
  failed: 'Ошибка'
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  opened: 'bg-yellow-100 text-yellow-800',
  clicked: 'bg-purple-100 text-purple-800',
  replied: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800'
};

const CampaignsManagement = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const fetchCampaigns = async () => {
    try {
      let query = supabase
        .from('email_campaigns')
        .select(`
          *,
          parsed_companies!inner(company_name, email, country, status),
          email_templates!inner(name, subject)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные кампаний',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createCampaignForCompany = async (companyId: string, templateId: string) => {
    try {
      const { error } = await supabase
        .from('email_campaigns')
        .insert({
          company_id: companyId,
          template_id: templateId,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Кампания создана',
      });

      fetchCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать кампанию',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const stats = {
    total: campaigns.length,
    sent: campaigns.filter(c => c.status === 'sent' || c.status === 'delivered' || c.status === 'opened' || c.status === 'clicked' || c.status === 'replied').length,
    opened: campaigns.filter(c => c.opened_at).length,
    clicked: campaigns.filter(c => c.clicked_at).length,
    replied: campaigns.filter(c => c.replied_at).length,
    failed: campaigns.filter(c => c.status === 'failed').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'opened':
      case 'clicked':
      case 'replied':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление рассылками</h1>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Создать рассылку
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Всего кампаний</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
            <div className="text-sm text-muted-foreground">Отправлено</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.opened}</div>
            <div className="text-sm text-muted-foreground">Открыто</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.clicked}</div>
            <div className="text-sm text-muted-foreground">Кликнуто</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
            <div className="text-sm text-muted-foreground">Отвечено</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-muted-foreground">Ошибки</div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Список кампаний */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-8">Загрузка...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-8">
            <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Кампании не найдены</p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(campaign.status)}
                    <div>
                      <h3 className="font-semibold">{campaign.parsed_companies.company_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Шаблон: {campaign.email_templates.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Email: {campaign.parsed_companies.email || 'Не указан'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                        {statusLabels[campaign.status as keyof typeof statusLabels]}
                      </Badge>
                      {campaign.sent_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Отправлено: {format(new Date(campaign.sent_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Статистика
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Статистика кампании для {campaign.parsed_companies.company_name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Компания</label>
                                <div className="text-sm text-muted-foreground">
                                  {campaign.parsed_companies.company_name}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <div className="text-sm text-muted-foreground">
                                  {campaign.parsed_companies.email || 'Не указан'}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Шаблон письма</label>
                              <div className="text-sm text-muted-foreground">
                                {campaign.email_templates.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Тема: {campaign.email_templates.subject}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Статус</label>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(campaign.status)}
                                  <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                                    {statusLabels[campaign.status as keyof typeof statusLabels]}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Создано</label>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(campaign.created_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                                </div>
                              </div>
                            </div>
                            
                            {campaign.sent_at && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Отправлено</label>
                                  <div className="text-sm text-muted-foreground flex items-center space-x-2">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {format(new Date(campaign.sent_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                                    </span>
                                  </div>
                                </div>
                                {campaign.opened_at && (
                                  <div>
                                    <label className="text-sm font-medium">Открыто</label>
                                    <div className="text-sm text-muted-foreground flex items-center space-x-2">
                                      <Eye className="h-3 w-3" />
                                      <span>
                                        {format(new Date(campaign.opened_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {campaign.clicked_at && (
                              <div>
                                <label className="text-sm font-medium">Клик по ссылке</label>
                                <div className="text-sm text-muted-foreground flex items-center space-x-2">
                                  <Target className="h-3 w-3" />
                                  <span>
                                    {format(new Date(campaign.clicked_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {campaign.replied_at && (
                              <div>
                                <label className="text-sm font-medium">Получен ответ</label>
                                <div className="text-sm text-muted-foreground flex items-center space-x-2">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  <span>
                                    {format(new Date(campaign.replied_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {campaign.error_message && (
                              <div>
                                <label className="text-sm font-medium text-red-600">Ошибка</label>
                                <div className="text-sm text-red-600 p-2 bg-red-50 rounded">
                                  {campaign.error_message}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
                
                {/* Прогресс-бар для отслеживания */}
                <div className="mt-4">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className={`flex items-center space-x-1 ${campaign.status === 'draft' ? 'text-gray-600' : 'text-blue-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${campaign.status === 'draft' ? 'bg-gray-400' : 'bg-blue-500'}`} />
                      <span>Создано</span>
                    </div>
                    <div className="w-4 h-px bg-gray-300" />
                    <div className={`flex items-center space-x-1 ${!campaign.sent_at ? 'text-gray-400' : 'text-green-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${!campaign.sent_at ? 'bg-gray-300' : 'bg-green-500'}`} />
                      <span>Отправлено</span>
                    </div>
                    <div className="w-4 h-px bg-gray-300" />
                    <div className={`flex items-center space-x-1 ${!campaign.opened_at ? 'text-gray-400' : 'text-yellow-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${!campaign.opened_at ? 'bg-gray-300' : 'bg-yellow-500'}`} />
                      <span>Открыто</span>
                    </div>
                    <div className="w-4 h-px bg-gray-300" />
                    <div className={`flex items-center space-x-1 ${!campaign.replied_at ? 'text-gray-400' : 'text-emerald-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${!campaign.replied_at ? 'bg-gray-300' : 'bg-emerald-500'}`} />
                      <span>Ответ получен</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CampaignsManagement;