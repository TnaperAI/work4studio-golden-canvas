import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

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
}

interface TeamMemberTranslation {
  id: string;
  team_member_id: string;
  language: string;
  name: string;
  position: string;
  description: string | null;
  skills: string[] | null;
  experience: string | null;
}

interface TeamGridProps {
  members: TeamMember[];
}

export const TeamCarousel = ({ members }: TeamGridProps) => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<{[key: string]: TeamMemberTranslation[]}>({});

  console.log('🔍 TeamCarousel received members:', members?.length || 0);

  useEffect(() => {
    if (members && members.length > 0) {
      fetchTranslations();
    }
  }, [members, language]);

  const fetchTranslations = async () => {
    if (!members || members.length === 0) {
      return;
    }
    
    try {
      console.log('🔍 Fetching translations for language:', language);
      const { data, error } = await supabase
        .from('team_member_translations')
        .select('*');

      if (error) {
        console.error('❌ Translation fetch error:', error);
        return;
      }
      
      console.log('✅ Translations fetched:', data?.length || 0);
      
      const translationsByMember: {[key: string]: TeamMemberTranslation[]} = {};
      data?.forEach(translation => {
        if (!translationsByMember[translation.team_member_id]) {
          translationsByMember[translation.team_member_id] = [];
        }
        translationsByMember[translation.team_member_id].push(translation);
      });
      
      setTranslations(translationsByMember);
    } catch (error) {
      console.error('❌ Error fetching translations:', error);
    }
  };

  const getDisplaySkills = (member: TeamMember) => {
    const memberTranslations = translations[member.id] || [];
    const currentTranslation = memberTranslations.find(t => t.language === language);
    return currentTranslation?.skills || member.skills;
  };

  const getDisplayExperience = (member: TeamMember) => {
    const memberTranslations = translations[member.id] || [];
    const currentTranslation = memberTranslations.find(t => t.language === language);
    return currentTranslation?.experience || member.experience;
  };

  const localizeExperience = (exp: string | null) => {
    if (!exp) return '';
    if (language === 'en') {
      const match = exp.match(/(\d+)\s*(\+?)/);
      if (match) {
        const n = parseInt(match[1], 10);
        const plus = match[2] === '+' || /\+/.test(exp);
        const suffix = n === 1 ? 'year' : 'years';
        return `${n}${plus ? '+' : ''} ${suffix}`;
      }
      return exp
        .replace(/\bлет\b/gi, 'years')
        .replace(/\bгода\b/gi, 'years')
        .replace(/\bгод\b/gi, 'year');
    }
    return exp;
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

  // Если нет участников команды, не показываем ничего
  if (!members || members.length === 0) {
    console.log('❌ TeamCarousel: No members provided');
    return null;
  }

  console.log('✅ TeamCarousel: Rendering team members:', members.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((member) => (
        <div 
          key={member.id} 
          className="bg-card border border-border rounded-3xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 group text-center animate-on-scroll h-full"
        >
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-105 transition-transform duration-300">
              {member.image ? (
                <img 
                  src={member.image} 
                  alt={getDisplayName(member)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <span className="text-2xl font-heading font-bold text-primary">
                    {getDisplayName(member).split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
          </div>
          <h3 className="text-xl font-heading font-bold mb-2">{getDisplayName(member)}</h3>
          <p className="text-primary font-medium mb-2">{getDisplayPosition(member)}</p>
          <p className="text-sm text-muted-foreground mb-4">{localizeExperience(getDisplayExperience(member))}</p>
          {getDisplayDescription(member) && (
            <p className="text-muted-foreground leading-relaxed mb-6">{getDisplayDescription(member)}</p>
          )}
          {getDisplaySkills(member) && getDisplaySkills(member)!.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {getDisplaySkills(member)!.map((skill, skillIndex) => (
                <Badge key={skillIndex} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};