import { useState, useEffect } from 'react';
import { submissionService, Submission } from '../services/submissionService';

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    try {
      const data = await submissionService.getSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(submissionId: string) {
    try {
      await submissionService.updateSubmissionStatus(submissionId, 'approved');
      await loadSubmissions();
    } catch (err) {
      setError(err as Error);
    }
  }

  async function handleReject(submissionId: string) {
    try {
      await submissionService.updateSubmissionStatus(submissionId, 'rejected');
      await loadSubmissions();
    } catch (err) {
      setError(err as Error);
    }
  }

  async function handleMergeApproved(postId: string) {
    try {
      const mergedVideoUrl = await submissionService.mergeApprovedSubmissions(postId);
      return mergedVideoUrl;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  }

  return {
    submissions,
    loading,
    error,
    handleApprove,
    handleReject,
    handleMergeApproved,
  };
}