export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string; 
  socials?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
}

import ReshuImg from '../Assets/Reshu.jpg';
import SmitImg from '../Assets/Smit.jpg';

export const team: TeamMember[] = [
  {
    name: 'Reshu Agarwal',
    role: 'Founder',
    bio: 'Meet Reshu Agarwal — the heart behind our studio. With four years of experience in interior design, she loves creating spaces that feel both beautiful and practical. For her, design isn’t just about trends; it’s about understanding what makes you feel at home. Every detail is shaped around your lifestyle, so the spaces she creates reflect not just style, but you.',
    image: ReshuImg,
  },
  {
    name: 'Smit Tanna',
    role: 'Co-Founder',
    bio: 'Say hello to Smit Tanna — the co-founder of our studio and the driving force behind turning ideas into reality. With an eye for detail and a passion for flawless execution, he makes sure every project flows smoothly from vision to completion. For Smit, it’s all about bringing the design dream to life seamlessly, so you can enjoy the space just as you imagined it.',
    image: SmitImg,
  },
];
