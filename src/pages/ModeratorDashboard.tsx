import { useState, useEffect } from 'react';
import { useSubmissions } from '../hooks/useSubmissions';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon, FilmIcon } from '@heroicons/react/24/outline';

interface SubmissionGroup {
  postId: string;
  postTitle: string;
  submissions: Submission[];
}

interface Submission {
  id: string;
  userId: string;
  postId: string;
  mediaUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  postTitle?: string;
}

export default function ModeratorDashboard() {
  const { submissions, loading, error, handleApprove, handleReject, handleMergeApproved } = useSubmissions();
  const [merging, setMerging] = useState<{ [key: string]: boolean }>({});
  const [groupedSubmissions, setGroupedSubmissions] = useState<SubmissionGroup[]>([]);

  useEffect(() => {
    if (submissions.length > 0) {
      const groups = submissions.reduce((acc: SubmissionGroup[], submission) => {
        const existingGroup = acc.find(group => group.postId === submission.postId);
        if (existingGroup) {
          existingGroup.submissions.push(submission);
        } else {
          acc.push({
            postId: submission.postId,
            postTitle: submission.postTitle || 'Untitled Post',
            submissions: [submission]
          });
        }
        return acc;
      }, []);
      setGroupedSubmissions(groups);
    }
  }, [submissions]);

  const handleMergeSubmissions = async (postId: string) => {
    setMerging({ ...merging, [postId]: true });
    try {
      const mergedVideoUrl = await handleMergeApproved(postId);
      if (mergedVideoUrl) {
        // Download the merged video
        const link = document.createElement('a');
        link.href = mergedVideoUrl;
        link.download = `merged-video-${postId}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error merging videos:', err);
    } finally {
      setMerging({ ...merging, [postId]: false });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading submissions: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Moderator Dashboard</h1>
      
      <div className="space-y-8">
        {groupedSubmissions.map((group) => (
          <div key={group.postId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{group.postTitle}</h2>
                <button
                  onClick={() => handleMergeSubmissions(group.postId)}
                  disabled={merging[group.postId] || group.submissions.filter(s => s.status === 'approved').length === 0}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    merging[group.postId] || group.submissions.filter(s => s.status === 'approved').length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {merging[group.postId] ? (
                    <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <FilmIcon className="w-5 h-5 mr-2" />
                  )}
                  {merging[group.postId] ? 'Merging...' : 'Merge Approved'}
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {group.submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4">
                        <video
                          className="w-48 rounded shadow-sm"
                          controls
                          src={submission.mediaUrl}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          submission.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : submission.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-4">
                        {submission.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(submission.id)}
                              className="text-green-600 hover:text-green-900 inline-flex items-center"
                            >
                              <CheckCircleIcon className="w-5 h-5 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(submission.id)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center"
                            >
                              <XCircleIcon className="w-5 h-5 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}