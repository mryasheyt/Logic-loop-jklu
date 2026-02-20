import { useEffect, useCallback } from 'react'
import { useNudgeStore } from '../store/nudgeStore'
import { getPendingNudges, dismissNudge } from '../api/nudges.api'

export const useNudges = () => {
    const { nudges, setNudges, removeNudge } = useNudgeStore()

    const fetchNudges = useCallback(async () => {
        try {
            const { data } = await getPendingNudges()
            if (data.nudges?.length) setNudges(data.nudges)
        } catch {
            // silently fail
        }
    }, [setNudges])

    const dismiss = useCallback(async (id) => {
        removeNudge(id)
        try {
            await dismissNudge(id)
        } catch {
            // silently fail
        }
    }, [removeNudge])

    useEffect(() => {
        fetchNudges()
        const interval = setInterval(fetchNudges, 60000)
        return () => clearInterval(interval)
    }, [fetchNudges])

    return { nudges, dismiss }
}
