import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ParsedCompany {
  id: string;
  company_name: string;
  website: string;
  email: string;
  phone: string;
  city: string;
  industry: string;
  status: string;
  parsed_at: string;
}

const CompanyParser = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    city: '',
    industry: '',
    limit: '50'
  });
  const [companies, setCompanies] = useState<ParsedCompany[]>([]);
  const [totalFound, setTotalFound] = useState(0);

  const industries = [
    { value: 'медицина', label: 'Медицина и здравоохранение' },
    { value: 'стоматология', label: 'Стоматология' },
    { value: 'автосервис', label: 'Автосервис' },
    { value: 'ресторан', label: 'Рестораны и кафе' },
    { value: 'красота', label: 'Красота и здоровье' },
    { value: 'образование', label: 'Образование' },
    { value: 'недвижимость', label: 'Недвижимость' },
    { value: 'спорт', label: 'Спорт и фитнес' },
    { value: 'юридические', label: 'Юридические услуги' },
    { value: 'строительство', label: 'Строительство' }
  ];

  const handleSearch = async () => {
    if (!searchData.city || !searchData.industry) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля для поиска",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-companies', {
        body: {
          city: searchData.city,
          industry: searchData.industry,
          limit: parseInt(searchData.limit)
        }
      });

      if (error) throw error;

      setTotalFound(data.total || 0);
      await loadCompanies();
      
      toast({
        title: "Поиск завершен",
        description: `Найдено ${data.total || 0} компаний`,
      });
    } catch (error) {
      console.error('Error parsing companies:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка при поиске компаний",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('parsed_companies')
        .select('*')
        .order('parsed_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const updateCompanyStatus = async (id: string, status: 'new' | 'contacted' | 'proposal_sent' | 'in_negotiation' | 'closed_won' | 'closed_lost' | 'not_interested') => {
    try {
      const { error } = await supabase
        .from('parsed_companies')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setCompanies(prev => 
        prev.map(company => 
          company.id === id ? { ...company, status } : company
        )
      );

      toast({
        title: "Статус обновлен",
        description: "Статус компании успешно обновлен",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка при обновлении статуса",
        variant: "destructive",
      });
    }
  };

  const exportToCsv = () => {
    const headers = ['Название', 'Сайт', 'Email', 'Телефон', 'Город', 'Сфера', 'Статус'];
    const csvContent = [
      headers.join(','),
      ...companies.map(company => [
        `"${company.company_name}"`,
        company.website || '',
        company.email || '',
        company.phone || '',
        company.city || '',
        company.industry || '',
        company.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `companies-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'proposal_sent': return 'bg-purple-100 text-purple-800';
      case 'in_negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed_won': return 'bg-green-100 text-green-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      case 'not_interested': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Поиск компаний
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Город</Label>
              <Input
                id="city"
                placeholder="Москва"
                value={searchData.city}
                onChange={(e) => setSearchData(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="industry">Сфера деятельности</Label>
              <Select 
                value={searchData.industry} 
                onValueChange={(value) => setSearchData(prev => ({ ...prev, industry: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите сферу" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="limit">Количество</Label>
              <Select 
                value={searchData.limit} 
                onValueChange={(value) => setSearchData(prev => ({ ...prev, limit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 компаний</SelectItem>
                  <SelectItem value="50">50 компаний</SelectItem>
                  <SelectItem value="100">100 компаний</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isLoading ? 'Поиск...' : 'Найти компании'}
            </Button>
            
            {companies.length > 0 && (
              <Button 
                variant="outline" 
                onClick={exportToCsv}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Экспорт CSV
              </Button>
            )}
          </div>

          {totalFound > 0 && (
            <div className="text-sm text-muted-foreground">
              Всего найдено: {totalFound} компаний
            </div>
          )}
        </CardContent>
      </Card>

      {companies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Найденные компании ({companies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Сайт</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Город</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.company_name}</TableCell>
                      <TableCell>
                        {company.website && (
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {company.website}
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        {company.email && (
                          <a href={`mailto:${company.email}`} className="text-blue-600 underline">
                            {company.email}
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        {company.phone && (
                          <a href={`tel:${company.phone}`} className="text-blue-600 underline">
                            {company.phone}
                          </a>
                        )}
                      </TableCell>
                      <TableCell>{company.city}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(company.status)}>
                          {company.status === 'new' && 'Новый'}
                          {company.status === 'contacted' && 'Связались'}
                          {company.status === 'proposal_sent' && 'КП отправлено'}
                          {company.status === 'in_negotiation' && 'Переговоры'}
                          {company.status === 'closed_won' && 'Сделка'}
                          {company.status === 'closed_lost' && 'Отказ'}
                          {company.status === 'not_interested' && 'Не интересно'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={company.status} 
                          onValueChange={(value) => updateCompanyStatus(company.id, value as 'new' | 'contacted' | 'proposal_sent' | 'in_negotiation' | 'closed_won' | 'closed_lost' | 'not_interested')}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Новый</SelectItem>
                            <SelectItem value="contacted">Связались</SelectItem>
                            <SelectItem value="proposal_sent">КП отправлено</SelectItem>
                            <SelectItem value="in_negotiation">Переговоры</SelectItem>
                            <SelectItem value="closed_won">Сделка</SelectItem>
                            <SelectItem value="closed_lost">Отказ</SelectItem>
                            <SelectItem value="not_interested">Не интересно</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyParser;