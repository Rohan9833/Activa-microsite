import {
  Eye,
  Pointer,
  Tablet,
  Target,
  Lightbulb,
  TabletSmartphone,
  Users,
  Star,
  Brain,
  Settings,
  TrendingUp,
  RotateCw,
  ListOrdered,
  SlidersHorizontal,
  MousePointerClick,
  Move,
} from 'lucide-react';

import rotate1x from '../assets/images/interaction-rotate.webp';
import rotate2x from '../assets/images/interaction-rotate@2x.webp';
import cardSequence from '../assets/illustrations/card-sequence.svg';
import ipadSeq1x from '../assets/images/ipad-sequence.webp';
import ipadSeq2x from '../assets/images/ipad-sequence@2x.webp';
import ipadAnim1x from '../assets/images/ipad-animation.webp';
import ipadAnim2x from '../assets/images/ipad-animation@2x.webp';
import cardEqualizer from '../assets/illustrations/card-equalizer.svg';
import cardSelect from '../assets/illustrations/card-select-remove.svg';
import cardAnimation from '../assets/illustrations/card-animation.svg';

// Rotate uses the approved full illustration; the other four pair a card-side
// illustration with the shared iPad photo plus an on-screen response overlay.
export const ROTATE_IMAGE = { src: rotate1x, srcSet: `${rotate1x} 976w, ${rotate2x} 1952w` };

export const NAV_LINKS = [
  { label: 'Experiences', href: '#experiences' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Why ActiVA?', href: '#why-activa' },
  { label: 'FAQ', href: '#faq' },
];

export const FLOW_STEPS = [
  {
    title: 'See',
    text: 'The MR introduces the brand story on iPad.',
    icon: Eye,
    tint: 'from-[#E6F0FF] to-[#F3F7FF]',
    iconBg: 'from-[#0866F5] to-[#3D7DF8]',
    titleColor: 'text-brand-blue',
  },
  {
    title: 'Interact',
    text: 'The doctor engages with physical materials.',
    icon: Pointer,
    tint: 'from-[#EFE7FF] to-[#F7F3FF]',
    iconBg: 'from-[#5A3CF2] to-[#8B3CF5]',
    titleColor: 'text-brand-violet',
  },
  {
    title: 'Discover',
    text: 'The iPad reveals the relevant content.',
    icon: Tablet,
    tint: 'from-[#FBE6FD] to-[#FDF3FE]',
    iconBg: 'from-[#A62FEF] to-[#DD10E8]',
    titleColor: 'text-[#C214D6]',
  },
];

export const INTERACTIONS = [
  {
    id: 'rotate',
    label: 'Rotate',
    icon: RotateCw,
    title: 'Rotate',
    description: 'Turn the physical card to reveal different brand messages.',
    image: ROTATE_IMAGE,
    animated: 'rotate',
    alt: 'Animation: each time the printed ActiVA card turns 90 degrees clockwise, the iPad moves to the next slide: Same 3 Symptom Dimensions, then patient Meera Sharma, then patient Suresh Patil.',
  },
  {
    id: 'sequence',
    label: 'Sequence',
    icon: ListOrdered,
    title: 'Sequence',
    description: 'Change the order of physical cards to change the story.',
    animated: 'sequence',
    cardSide: cardSequence,
    ipad: { src: ipadSeq1x, srcSet: `${ipadSeq1x} 524w, ${ipadSeq2x} 1048w` },
    alt: 'Animation: two symptom cards swap places and the iPad shows the matching patient story. Persistence, Motility, Acid shows the Same 3 Symptom Dimensions slide; Acid, Motility, Persistence shows Rajesh Mehta; Motility, Acid, Persistence shows Anita Sharma.',
  },
  {
    id: 'equalizer',
    label: 'Equalizer',
    icon: SlidersHorizontal,
    title: 'Equalizer',
    description: 'Move a physical element up or down to see the response.',
    animated: 'equalizer',
    cardSide: cardEqualizer,
    ipad: { src: ipadSeq1x, srcSet: `${ipadSeq1x} 524w, ${ipadSeq2x} 1048w` },
    alt: 'Animation: the printed equaliser card moves up and the iPad shows patient Rupam Hazarika, moves down and the iPad shows patient Meera Sharma, then returns to the centre and the iPad shows the Same 3 Symptom Dimensions slide.',
  },
  {
    id: 'select',
    label: 'Select',
    icon: MousePointerClick,
    title: 'Select',
    description: 'Make a choice. Reveal relevant content.',
    animated: 'select',
    cardSide: cardSelect,
    overlay: 'select',
    alt: 'Animation: three patient cards sit in a row while the iPad shows the Same 3 Symptom Dimensions slide. When the middle card is picked up the iPad shows Meera Sharma, the first card shows Rajesh Mehta, and the third card shows Suresh Patil.',
  },
  {
    id: 'animation',
    label: 'Animation',
    icon: Move,
    title: 'Animation',
    description: 'Move the physical element to control the digital experience.',
    animated: 'animation',
    cardSide: cardAnimation,
    ipad: { src: ipadAnim1x, srcSet: `${ipadAnim1x} 524w, ${ipadAnim2x} 1048w` },
    alt: 'Animation: as the printed character card slides to the right towards the iPad, the same character walks from the left end to the right end of the line on the iPad slide, then both return and the loop repeats.',
  },
];

export const BRAND_STEPS = [
  { title: 'Brand Objective', text: 'Define the key message or need.', icon: Target, tint: 'from-[#E8F1FF] to-[#F5F8FF]', iconColor: 'text-brand-blue' },
  { title: 'Interaction Idea', text: 'Create a relevant physical interaction.', icon: Lightbulb, tint: 'from-[#F0E9FF] to-[#F8F5FF]', iconColor: 'text-brand-violet' },
  { title: 'ActiVA Experience', text: 'Deliver a participative detailing experience on iPad.', icon: TabletSmartphone, tint: 'from-[#FCE8FD] to-[#FEF4FE]', iconColor: 'text-[#C214D6]' },
];

export const BENEFITS = [
  { title: 'Engage', text: 'Encourage active doctor participation.', icon: Users, tint: 'from-[#E4EEFF] to-[#F4F8FF]', iconColor: 'text-brand-blue' },
  { title: 'Differentiate', text: 'Create an experience beyond conventional visual-aid detailing.', icon: Star, tint: 'from-[#ECE6FF] to-[#F7F4FF]', iconColor: 'text-brand-violet' },
  { title: 'Memorize', text: 'Use physical participation to reinforce key brand messages.', icon: Brain, tint: 'from-[#F6E4FF] to-[#FBF4FF]', iconColor: 'text-[#A62FEF]' },
  { title: 'Customize', text: 'Adapt interactions to different brands, therapies and campaigns.', icon: Settings, tint: 'from-[#FFE6EC] to-[#FFF5F7]', iconColor: 'text-[#E23A5E]' },
  { title: 'Extend', text: 'Develop additional interaction formats as needed.', icon: TrendingUp, tint: 'from-[#FDE4F7] to-[#FEF4FC]', iconColor: 'text-[#D012C9]' },
];
