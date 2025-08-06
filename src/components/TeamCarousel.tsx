import { Badge } from '@/components/ui/badge';

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

interface TeamGridProps {
  members: TeamMember[];
}

export const TeamCarousel = ({ members }: TeamGridProps) => {
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
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <span className="text-2xl font-heading font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
          </div>
          <h3 className="text-xl font-heading font-bold mb-2">{member.name}</h3>
          <p className="text-primary font-medium mb-2">{member.position}</p>
          <p className="text-sm text-muted-foreground mb-4">{member.experience}</p>
          <p className="text-muted-foreground leading-relaxed mb-6">{member.description}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {member.skills.map((skill, skillIndex) => (
              <Badge key={skillIndex} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};