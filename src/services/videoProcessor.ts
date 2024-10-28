import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { videoEffects, transitionEffects } from './videoEffects';

class VideoProcessor {
  private ffmpeg: FFmpeg | null = null;

  async init() {
    if (this.ffmpeg) return;

    this.ffmpeg = new FFmpeg();
    await this.ffmpeg.load();
  }

  async processVideo(videoBlob: Blob, effectName: string = 'Vibrant'): Promise<Blob> {
    if (!this.ffmpeg) await this.init();

    const inputFileName = 'input.webm';
    const outputFileName = 'output.mp4';
    const effect = videoEffects.find(e => e.name === effectName) || videoEffects[0];

    await this.ffmpeg!.writeFile(inputFileName, await fetchFile(videoBlob));

    await this.ffmpeg!.exec([
      '-i', inputFileName,
      '-vf', effect.filter,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-c:a', 'aac',
      outputFileName
    ]);

    const data = await this.ffmpeg!.readFile(outputFileName);
    return new Blob([data], { type: 'video/mp4' });
  }

  async mergeVideos(videoBlobs: Blob[], transitionName: string = 'Fade'): Promise<Blob> {
    if (!this.ffmpeg) await this.init();

    const transition = transitionEffects.find(t => t.name === transitionName) || transitionEffects[0];
    const inputFiles: string[] = [];
    const filterComplex: string[] = [];

    // Write input files
    for (let i = 0; i < videoBlobs.length; i++) {
      const fileName = `input${i}.mp4`;
      await this.ffmpeg!.writeFile(fileName, await fetchFile(videoBlobs[i]));
      inputFiles.push('-i', fileName);
      
      if (i > 0) {
        filterComplex.push(`[${i-1}][${i}]${transition.filter}[t${i}];`);
      }
    }

    // Build the filter complex string
    const filterStr = filterComplex.join('');

    // Execute FFmpeg command with transitions
    await this.ffmpeg!.exec([
      ...inputFiles,
      '-filter_complex', filterStr,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-c:a', 'aac',
      'output.mp4'
    ]);

    const data = await this.ffmpeg!.readFile('output.mp4');
    return new Blob([data], { type: 'video/mp4' });
  }

  async addWatermark(videoBlob: Blob, text: string): Promise<Blob> {
    if (!this.ffmpeg) await this.init();

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp4';

    await this.ffmpeg!.writeFile(inputFileName, await fetchFile(videoBlob));

    await this.ffmpeg!.exec([
      '-i', inputFileName,
      '-vf', `drawtext=text='${text}':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=h-th-10`,
      '-codec:a', 'copy',
      outputFileName
    ]);

    const data = await this.ffmpeg!.readFile(outputFileName);
    return new Blob([data], { type: 'video/mp4' });
  }
}

export const videoProcessor = new VideoProcessor();