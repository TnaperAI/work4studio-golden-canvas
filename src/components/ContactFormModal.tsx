import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import ConsentCheckbox from '@/components/ConsentCheckbox';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string; // Добавляем пропс для источника
}

const ContactFormModal = ({ isOpen, onClose, source = 'modal' }: ContactFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAgreed) {
      toast({
        title: currentLanguage === 'en' ? "Consent required" : "Согласие обязательно",
        description: currentLanguage === 'en' 
          ? "You must agree to the terms to submit the request."
          : "Необходимо согласиться с условиями для отправки заявки.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            message: formData.message,
            source: source
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: currentLanguage === 'en' ? "Request sent!" : "Заявка отправлена!",
        description: currentLanguage === 'en' 
          ? "We received your request and will contact you shortly."
          : "Мы получили вашу заявку и свяжемся с вами в ближайшее время.",
      });

      onClose();
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsAgreed(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: currentLanguage === 'en' ? "Error" : "Ошибка",
        description: currentLanguage === 'en' 
          ? "An error occurred while submitting the request. Please try again."
          : "Произошла ошибка при отправке заявки. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-center">
            {currentLanguage === 'en' ? 'Discuss project' : 'Обсудить проект'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{currentLanguage === 'en' ? 'Name *' : 'Имя *'}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={currentLanguage === 'en' ? 'Your name' : 'Ваше имя'}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">{currentLanguage === 'en' ? 'Phone' : 'Телефон'}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+20 109 645 3054"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="message">{currentLanguage === 'en' ? 'Tell us about your project *' : 'Расскажите о проекте *'}</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={currentLanguage === 'en' ? 'Describe your project, goals and requirements...' : 'Опишите ваш проект, цели и пожелания...'}
                required
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>

          <ConsentCheckbox 
            isAgreed={isAgreed} 
            onChange={setIsAgreed}
            className="mb-6"
          />
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              {currentLanguage === 'en' ? 'Cancel' : 'Отмена'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold flex-1 inline-flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{currentLanguage === 'en' ? 'Submit' : 'Отправить'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormModal;