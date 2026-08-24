import React, { useEffect, useRef } from 'react';

export interface TechItem {
    name: string;
    iconClass: string;
    badge: string;
    color: string;
}

export interface PoemAnimationProps {
    poemHTML?: string;
    backgroundImageUrl?: string;
    boyImageUrl?: string;
    techStack?: TechItem[];
}

/**
 * Renders the 3D Tech Stack Cube & Reflection Animation Hero / Section.
 * Features GPU-accelerated 3D CSS transforms, reflection, and requestAnimationFrame throttled resize.
 */
export const PoemAnimation: React.FC<PoemAnimationProps> = ({
    backgroundImageUrl = "img/sviva/svivaindex.jpeg",
    boyImageUrl = "img/sviva/svivalogo.png",
    techStack
}) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // Responsive auto-scaling with requestAnimationFrame throttling
    useEffect(() => {
        let animationFrameId: number;

        function adjustContentSize() {
            if (contentRef.current) {
                const viewportWidth = window.innerWidth;
                const baseWidth = 1000;
                const scaleFactor = viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.9 : 1;
                contentRef.current.style.transform = `scale(${scaleFactor})`;
            }
        }

        function handleResize() {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(adjustContentSize);
        }

        adjustContentSize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const defaultTech: TechItem[] = techStack || [
        { name: "Python 3.11", iconClass: "fab fa-python", badge: "98% CORE", color: "#3776AB" },
        { name: "YOLOv8 AI", iconClass: "fas fa-eye", badge: "95% VISIÓN", color: "#11d483" },
        { name: "Three.js", iconClass: "fas fa-cube", badge: "94% 3D & GLSL", color: "#00ffff" },
        { name: "FastAPI", iconClass: "fas fa-bolt", badge: "96% ASYNC", color: "#059669" },
        { name: "React & TS", iconClass: "fab fa-react", badge: "92% FRONTEND", color: "#61DAFB" },
        { name: "PostgreSQL", iconClass: "fas fa-database", badge: "93% DATABASE", color: "#4169E1" }
    ];

    return (
        <header className="hero-section tech-cube-hero">
            <div className="container">
                <div 
                    ref={contentRef} 
                    className="content" 
                    style={{ display: 'block', width: '1000px', height: '562px', transformOrigin: 'top center' }}
                >
                    <div className="container-full">
                        <div className="animated hue"></div>
                        {backgroundImageUrl && (
                            <img 
                                className="backgroundImage" 
                                src={backgroundImageUrl} 
                                alt="VANTA Engineering Background" 
                                onError={(e) => (e.currentTarget.style.display = 'none')} 
                            />
                        )}
                        {boyImageUrl && (
                            <img 
                                className="boyImage" 
                                src={boyImageUrl} 
                                alt="VANTA Core Node" 
                                onError={(e) => (e.currentTarget.style.display = 'none')} 
                            />
                        )}
                        
                        {/* Main 3D Cube */}
                        <div className="container">
                            <div className="cube">
                                <div className="face top">
                                    <i className={defaultTech[4].iconClass} style={{ color: defaultTech[4].color, fontSize: '2.5rem' }}></i>
                                    <div>{defaultTech[4].name}</div>
                                </div>
                                <div className="face bottom">
                                    <i className={defaultTech[5].iconClass} style={{ color: defaultTech[5].color, fontSize: '2.5rem' }}></i>
                                    <div>{defaultTech[5].name}</div>
                                </div>
                                <div className="face left text">
                                    <i className={defaultTech[2].iconClass} style={{ color: defaultTech[2].color, fontSize: '2.5rem' }}></i>
                                    <div>{defaultTech[2].name}</div>
                                </div>
                                <div className="face right text">
                                    <i className={defaultTech[3].iconClass} style={{ color: defaultTech[3].color, fontSize: '2.5rem' }}></i>
                                    <div>{defaultTech[3].name}</div>
                                </div>
                                <div className="face front">
                                    <i className={defaultTech[0].iconClass} style={{ color: defaultTech[0].color, fontSize: '2.5rem' }}></i>
                                    <div>{defaultTech[0].name}</div>
                                </div>
                                <div className="face back text">
                                    <i className={defaultTech[1].iconClass} style={{ color: defaultTech[1].color, fontSize: '2.5rem' }}></i>
                                    <div>{defaultTech[1].name}</div>
                                </div>
                            </div>
                        </div>

                        {/* 3D Floor Reflection */}
                        <div className="container-reflect">
                            <div className="cube">
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                                <div className="face left text"><div>{defaultTech[2].name}</div></div>
                                <div className="face right text"><div>{defaultTech[3].name}</div></div>
                                <div className="face front"><div>{defaultTech[0].name}</div></div>
                                <div className="face back text"><div>{defaultTech[1].name}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};