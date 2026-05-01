import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDocuments, createDocument, deleteDocument, updateDocument } from '../services/api'

export const useDocuments = () => {
  const queryClient = useQueryClient()

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  })

  const createMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => queryClient.invalidateQueries(['documents']),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => queryClient.invalidateQueries(['documents']),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDocument(id, data),
    onSuccess: () => queryClient.invalidateQueries(['documents']),
  })

  return {
    documents,
    isLoading,
    createDocument: createMutation.mutate,
    deleteDocument: deleteMutation.mutate,
    updateDocument: updateMutation.mutate,
  }
}
