interface VideoEffect {
  name: string;
  filter: string;
}

export const videoEffects: VideoEffect[] = [
  {
    name: 'Vibrant',
    filter: 'colorbalance=rs=.3:gs=.3:bs=.3,eq=brightness=0.06:saturation=1.3',
  },
  {
    name: 'Cinematic',
    filter: 'curves=preset=darker,vignette=PI/4',
  },
  {
    name: 'Warm',
    filter: 'colorbalance=rs=.3:gs=.1:bs=-.1,eq=brightness=0.02:saturation=1.2',
  },
  {
    name: 'Cool',
    filter: 'colorbalance=rs=-.1:gs=.1:bs=.3,eq=brightness=0.02:saturation=1.1',
  },
  {
    name: 'Vintage',
    filter: 'colorbalance=rs=.2:gs=.1:bs=-.1,curves=preset=vintage,vignette',
  }
];

export const transitionEffects = [
  {
    name: 'Fade',
    filter: 'fade=t=in:st=0:d=1,fade=t=out:st=4:d=1',
  },
  {
    name: 'Crossfade',
    filter: 'xfade=transition=fade:duration=1',
  },
  {
    name: 'Slide',
    filter: 'xfade=transition=slideright:duration=1',
  },
  {
    name: 'Zoom',
    filter: 'xfade=transition=zoom:duration=1',
  }
];