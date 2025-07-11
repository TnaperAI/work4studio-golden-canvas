import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Search, 
  Filter, 
  CalendarIcon, 
  X,
  RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Filters {
  search: string;
  status: string;
  source: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  hasPhone: string;
}

interface ContactSubmissionFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  submissionCounts: {
    total: number;
    new: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
}

const ContactSubmissionFilters = ({ 
  filters, 
  onFiltersChange, 
  submissionCounts 
}: ContactSubmissionFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      status: '',
      source: '',
      dateFrom: undefined,
      dateTo: undefined,
      hasPhone: ''
    });
  };

  const hasActiveFilters = filters.search || filters.status || filters.source || filters.dateFrom || filters.dateTo || filters.hasPhone;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Новые';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершены';
      case 'cancelled': return 'Отменены';
      default: return status;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'homepage_form': return 'Форма на главной';
      case 'homepage_cta': return 'CTA на главной';
      case 'hero_section': return 'Hero секция';
      case 'header': return 'Шапка сайта';
      case 'contact_page': return 'Страница контактов';
      case 'services_page': return 'Страница услуг';
      case 'service_detail_page': return 'Детали услуги';
      case 'modal': return 'Модальное окно';
      default: return source || 'Неизвестно';
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Badge 
            variant={!filters.status ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => updateFilter('status', '')}
          >
            Все ({submissionCounts.total})
          </Badge>
          <Badge 
            variant={filters.status === 'new' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => updateFilter('status', 'new')}
          >
            Новые ({submissionCounts.new})
          </Badge>
          <Badge 
            variant={filters.status === 'in_progress' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => updateFilter('status', 'in_progress')}
          >
            В работе ({submissionCounts.in_progress})
          </Badge>
          <Badge 
            variant={filters.status === 'completed' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => updateFilter('status', 'completed')}
          >
            Завершены ({submissionCounts.completed})
          </Badge>
          <Badge 
            variant={filters.status === 'cancelled' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => updateFilter('status', 'cancelled')}
          >
            Отменены ({submissionCounts.cancelled})
          </Badge>
        </div>
      </div>

      {/* Search and advanced filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени, email, телефону или сообщению..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Фильтры
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                !
              </Badge>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Сбросить
            </Button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Статус</label>
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Новые</SelectItem>
                  <SelectItem value="in_progress">В работе</SelectItem>
                  <SelectItem value="completed">Завершены</SelectItem>
                  <SelectItem value="cancelled">Отменены</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Источник</label>
              <Select value={filters.source} onValueChange={(value) => updateFilter('source', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Все источники" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage_form">Форма на главной</SelectItem>
                  <SelectItem value="homepage_cta">CTA на главной</SelectItem>
                  <SelectItem value="hero_section">Hero секция</SelectItem>
                  <SelectItem value="header">Шапка сайта</SelectItem>
                  <SelectItem value="contact_page">Страница контактов</SelectItem>
                  <SelectItem value="services_page">Страница услуг</SelectItem>
                  <SelectItem value="service_detail_page">Детали услуги</SelectItem>
                  <SelectItem value="modal">Модальное окно</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Телефон</label>
              <Select value={filters.hasPhone} onValueChange={(value) => updateFilter('hasPhone', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Все" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">С телефоном</SelectItem>
                  <SelectItem value="no">Без телефона</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Дата от</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => updateFilter('dateFrom', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                  {filters.dateFrom && (
                    <div className="p-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateFilter('dateFrom', undefined)}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Очистить
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Дата до</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => updateFilter('dateTo', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                  {filters.dateTo && (
                    <div className="p-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateFilter('dateTo', undefined)}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Очистить
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Активные фильтры:</span>
              {filters.search && (
                <Badge variant="outline" className="gap-1">
                  Поиск: "{filters.search}"
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('search', '')}
                  />
                </Badge>
              )}
              {filters.status && (
                <Badge variant="outline" className="gap-1">
                  Статус: {getStatusLabel(filters.status)}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('status', '')}
                  />
                </Badge>
              )}
              {filters.hasPhone && (
                <Badge variant="outline" className="gap-1">
                  {filters.hasPhone === 'yes' ? 'С телефоном' : 'Без телефона'}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('hasPhone', '')}
                  />
                </Badge>
              )}
              {filters.source && (
                <Badge variant="outline" className="gap-1">
                  Источник: {getSourceLabel(filters.source)}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('source', '')}
                  />
                </Badge>
              )}
              {filters.dateFrom && (
                <Badge variant="outline" className="gap-1">
                  От: {format(filters.dateFrom, 'dd.MM.yyyy', { locale: ru })}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('dateFrom', undefined)}
                  />
                </Badge>
              )}
              {filters.dateTo && (
                <Badge variant="outline" className="gap-1">
                  До: {format(filters.dateTo, 'dd.MM.yyyy', { locale: ru })}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('dateTo', undefined)}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactSubmissionFilters;