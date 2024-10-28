import { supabase } from '../config/supabase';
import { videoProcessor } from './videoProcessor';

export interface Submission {
  id: string;
  userId: string;
  postId: string;
  mediaUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  postTitle?: string;
}

export const submissionService = {
  async uploadSubmission(postId: string, videoBlob: Blob): Promise<string> {
    // Process the video with effects
    const processedBlob = await videoProcessor.processVideo(videoBlob);
    
    // Upload to Supabase Storage
    const fileName = `submissions/${postId}/${Date.now()}.mp4`;
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, processedBlob);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    // Create submission record
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert([
        {
          post_id: postId,
          media_url: publicUrl,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (submissionError) throw submissionError;

    return publicUrl;
  },

  async getSubmissions(): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        posts (
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(submission => ({
      ...submission,
      postTitle: submission.posts?.title
    }));
  },

  async updateSubmissionStatus(
    submissionId: string,
    status: 'approved' | 'rejected'
  ): Promise<void> {
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', submissionId);

    if (error) throw error;
  },

  async mergeApprovedSubmissions(postId: string): Promise<string> {
    // Get all approved submissions for the post
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('media_url')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!submissions.length) {
      throw new Error('No approved submissions found');
    }

    // Download all videos
    const blobs = await Promise.all(
      submissions.map(async (sub) => {
        const response = await fetch(sub.media_url);
        return response.blob();
      })
    );

    // Merge videos
    const mergedBlob = await videoProcessor.mergeVideos(blobs);

    // Upload merged video
    const fileName = `merged/${postId}/${Date.now()}.mp4`;
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, mergedBlob);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    // Update post with merged video URL
    const { error: updateError } = await supabase
      .from('posts')
      .update({ merged_video_url: publicUrl })
      .eq('id', postId);

    if (updateError) throw updateError;

    return publicUrl;
  },
};