import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPeerFeed, createPeerPost, reactToPost, flagPost } from '../api/peer.api'

export const usePeerFeed = (category) => {
    return useQuery({
        queryKey: ['peerFeed', category],
        queryFn: () => getPeerFeed(category).then(r => r.data),
        staleTime: 30000,
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data) => createPeerPost(data).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['peerFeed'] })
        },
    })
}

export const useReactToPost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, reactionType }) => reactToPost(id, reactionType).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['peerFeed'] })
        },
    })
}

export const useFlagPost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id) => flagPost(id).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['peerFeed'] })
        },
    })
}
