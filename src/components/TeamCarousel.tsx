import { useCallback, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import useEmblaCarousel from 'embla-carousel-react';

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

interface TeamCarouselProps {
  members: TeamMember[];
  autoplay?: boolean;
}

export const TeamCarousel = ({ members, autoplay = false }: TeamCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: true,
  });

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !autoplay) return;

    const autoScroll = setInterval(() => {
      scrollNext();
    }, 3000);

    return () => clearInterval(autoScroll);
  }, [emblaApi, autoplay, scrollNext]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container flex">
        {members.map((member, index) => (
          <div key={member.id} className="embla__slide flex-[0_0_100%] md:flex-[0_0_33.333%] min-w-0 pl-4">
            <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 group text-center animate-on-scroll h-full">
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
          </div>
        ))}
      </div>
    </div>
  );
};