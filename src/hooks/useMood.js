import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { logMood, getMoodHistory, getMoodVelocity, getMoodInsights } from '../api/mood.api'

export const useMoodHistory = (days = 7) => {
    return useQuery({
        queryKey: ['moodHistory', days],
        queryFn: () => getMoodHistory(days).then(r => r.data),
        staleTime: 60000,
    })
}

export const useMoodVelocity = () => {
    return useQuery({
        queryKey: ['moodVelocity'],
        queryFn: () => getMoodVelocity().then(r => r.data),
        staleTime: 60000,
    })
}

export const useMoodInsights = () => {
    return useQuery({
        queryKey: ['moodInsights'],
        queryFn: () => getMoodInsights().then(r => r.data),
        staleTime: 60000,
    })
}

export const useLogMood = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data) => logMood(data).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moodHistory'] })
            queryClient.invalidateQueries({ queryKey: ['moodVelocity'] })
        },
    })
}
