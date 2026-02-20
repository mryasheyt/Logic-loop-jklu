import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { submitBurnoutCheckin, getBurnoutScore, getBurnoutTrend } from '../api/burnout.api'

export const useBurnoutScore = () => {
    return useQuery({
        queryKey: ['burnoutScore'],
        queryFn: () => getBurnoutScore().then(r => r.data),
        staleTime: 60000,
    })
}

export const useBurnoutTrend = () => {
    return useQuery({
        queryKey: ['burnoutTrend'],
        queryFn: () => getBurnoutTrend().then(r => r.data),
        staleTime: 60000,
    })
}

export const useBurnoutCheckin = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data) => submitBurnoutCheckin(data).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['burnoutScore'] })
            queryClient.invalidateQueries({ queryKey: ['burnoutTrend'] })
        },
    })
}
