import { Suspense, Component } from 'react';
import Spline from '@splinetool/react-spline';

// Error boundary to catch any Spline runtime crashes
class SplineErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return <div className="fixed inset-0 bg-[#0F0F1A]" />; // Fallback to solid color
        }
        return this.props.children;
    }
}

const SplineBackground = () => {
    return (
        <div className="fixed inset-0 z-[1] bg-[#0F0F1A] overflow-hidden pointer-events-none">

            {/* 1. Background Particles Scene */}
            <div className="absolute inset-0 opacity-30 scale-105">
                <SplineErrorBoundary>
                    <Suspense fallback={null}>
                        <Spline
                            scene="https://prod.spline.design/fafU7pSbHOb5AEtBX5vqCYAM/scene.splinecode"
                        />
                    </Suspense>
                </SplineErrorBoundary>
            </div>

            {/* 2. Focused Robot Scene */}
            <div className="absolute inset-0 opacity-50 scale-110">
                <SplineErrorBoundary>
                    <Suspense fallback={null}>
                        <Spline
                            scene="https://prod.spline.design/XcfxlIv3CT58o5IoYu0qIN0f/scene.splinecode"
                        />
                    </Suspense>
                </SplineErrorBoundary>
            </div>

            {/* Premium UI Glow Overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(circle at center, rgba(107,70,193,0.1) 0%, transparent 60%)',
                mixBlendMode: 'screen'
            }} />

            {/* Smooth Vignettes for Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F1A] via-transparent to-[#0F0F1A] pointer-events-none opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F1A] via-transparent to-[#0F0F1A] pointer-events-none opacity-50" />
        </div>
    );
};

export default SplineBackground;
