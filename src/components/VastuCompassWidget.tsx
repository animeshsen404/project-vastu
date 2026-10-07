import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Compass,
  RotateCw,
  RotateCcw,
  Sparkles,
  Home,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Smartphone,
  Info,
  Maximize2,
  Minimize2,
  X,
  Share2,
  Printer,
  ChevronDown,
  Layers,
  ShieldCheck,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';
import {
  VASTU_16_ZONES,
  ROOM_COMPLIANCE_RULES,
  FACING_PRESETS,
  VastuZoneInfo,
  RoomComplianceRule,
} from '../data/vastuCompassData';
import { useTheme } from '../context/ThemeContext';

interface VastuCompassWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
  fullPage?: boolean;
  onNavigateContact?: () => void;
}

export const VastuCompassWidget: React.FC<VastuCompassWidgetProps> = ({
  isOpen = false,
  onClose,
  fullPage = false,
  onNavigateContact,
}) => {
  const { isLight } = useTheme();

  // Target facing angle (degrees: 0 to 359)
  const [facingAngle, setFacingAngle] = useState<number>(0);
  // Rendered needle angle with physical spring oscillation
  const [needleAngle, setNeedleAngle] = useState<number>(0);
  const [activeZoneId, setActiveZoneId] = useState<string>('NE');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('mandir');
  const [viewMode, setViewMode] = useState<'chakra' | 'matrix'>('chakra');

  // Interactive Drag & Physics State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Device orientation sensor
  const [sensorActive, setSensorActive] = useState<boolean>(false);
  const [sensorSupported, setSensorSupported] = useState<boolean>(false);
  const [sensorMessage, setSensorMessage] = useState<string>('');

  // Refs for animation & interaction
  const compassDialRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const autoTourIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Physics animation variables
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  // Keep targetAngleRef synced
  useEffect(() => {
    targetAngleRef.current = facingAngle;
  }, [facingAngle]);

  // Audio Tick Generator (Gentle mechanical precision click)
  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, audioCtxRef.current.currentTime + 0.03);
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.035);
      }
    } catch {
      // Audio not permitted or supported
    }
  }, [soundEnabled]);

  // Spring & Magnetic Physics Loop with Idle Floating Motion
  useEffect(() => {
    let lastTime = performance.now();
    let tickCounter = 0;

    const physicsLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Micro ambient float (subtle natural magnetic sway of ±0.6° when idle)
      const ambientFloat = Math.sin(time * 0.0022) * 0.6;
      const effectiveTarget = targetAngleRef.current + ambientFloat;

      // Shortest circular angular distance (-180 to +180)
      let diff = (effectiveTarget - currentAngleRef.current) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      // Damped harmonic oscillator (Spring Physics)
      const springStiffness = isDragging ? 260 : 75;
      const dampingFactor = isDragging ? 22 : 9.5;

      const springForce = diff * springStiffness;
      const dampingForce = -velocityRef.current * dampingFactor;
      const acceleration = springForce + dampingForce;

      velocityRef.current += acceleration * dt;
      currentAngleRef.current += velocityRef.current * dt;

      setNeedleAngle(currentAngleRef.current);

      // Play tick sound when moving across degree thresholds
      if (Math.abs(velocityRef.current) > 15) {
        tickCounter += Math.abs(velocityRef.current) * dt;
        if (tickCounter > 12) {
          playTick();
          tickCounter = 0;
        }
      }

      animFrameRef.current = requestAnimationFrame(physicsLoop);
    };

    animFrameRef.current = requestAnimationFrame(physicsLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging, playTick]);

  // Auto Tour Animation: Sweeps through 8 cardinal & ordinal zones with live shastric readings
  const toggleAutoTour = () => {
    if (isAutoTouring) {
      if (autoTourIntervalRef.current) clearInterval(autoTourIntervalRef.current);
      setIsAutoTouring(false);
      return;
    }

    setIsAutoTouring(true);
    const tourAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    let step = 0;

    autoTourIntervalRef.current = setInterval(() => {
      step = (step + 1) % tourAngles.length;
      const nextAngle = tourAngles[step];
      setFacingAngle(nextAngle);
    }, 2400);
  };

  useEffect(() => {
    return () => {
      if (autoTourIntervalRef.current) clearInterval(autoTourIntervalRef.current);
    };
  }, []);

  // Direct Interactive Pointer Dragging on Compass Face
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (isAutoTouring) {
      if (autoTourIntervalRef.current) clearInterval(autoTourIntervalRef.current);
      setIsAutoTouring(false);
    }
    updateAngleFromPointer(e.clientX, e.clientY);
  };

  const updateAngleFromPointer = (clientX: number, clientY: number) => {
    if (!compassDialRef.current) return;
    const rect = compassDialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    // Calculate angle in degrees from center (0° is Up/North)
    let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;

    const rounded = Math.round(deg % 360);
    setFacingAngle(rounded);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      updateAngleFromPointer(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  // Wheel interaction on compass dial
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 3 : -3;
    setFacingAngle((prev) => (prev + delta + 360) % 360);
  };

  // Active zone data lookup
  const activeZone = useMemo(() => {
    return VASTU_16_ZONES.find((z) => z.id === activeZoneId) || VASTU_16_ZONES[0];
  }, [activeZoneId]);

  // Active room compliance lookup
  const activeRoom = useMemo(() => {
    return ROOM_COMPLIANCE_RULES.find((r) => r.id === selectedRoomId) || ROOM_COMPLIANCE_RULES[0];
  }, [selectedRoomId]);

  // Device orientation sensor support check
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setSensorSupported(true);
    }
  }, []);

  // Sensor toggle handler
  const toggleDeviceSensor = async () => {
    if (sensorActive) {
      setSensorActive(false);
      setSensorMessage('Live sensor stopped. Manual touch orientation active.');
      return;
    }

    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          setSensorMessage('Motion sensor permission was denied by device.');
          return;
        }
      }

      setSensorActive(true);
      setSensorMessage('Calibrating to device magnetic sensor...');

      const handleOrientation = (e: DeviceOrientationEvent) => {
        let heading: number | null = null;
        if ((e as any).webkitCompassHeading !== undefined) {
          heading = (e as any).webkitCompassHeading;
        } else if (e.alpha !== null) {
          heading = 360 - e.alpha;
        }

        if (heading !== null && !isNaN(heading)) {
          const normalized = Math.round(heading % 360);
          setFacingAngle(normalized);
          setSensorMessage(`Device Gyro Compass: ${normalized}° (${getCardinalCode(normalized)})`);
        }
      };

      window.addEventListener('deviceorientation', handleOrientation, true);

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    } catch (err) {
      console.warn('Compass sensor error:', err);
      setSensorMessage('Unable to access device magnetic sensor. Use touch dial.');
      setSensorActive(false);
    }
  };

  // Helper to get nearest cardinal direction for an angle
  const getCardinalCode = (deg: number): string => {
    const angle = (deg + 360) % 360;
    for (const z of VASTU_16_ZONES) {
      if (z.angleStart > z.angleEnd) {
        if (angle >= z.angleStart || angle < z.angleEnd) return `${z.code} · ${z.name}`;
      } else {
        if (angle >= z.angleStart && angle < z.angleEnd) return `${z.code} · ${z.name}`;
      }
    }
    return 'N · Uttara';
  };

  // Helper to determine compliance status for a zone regarding active room
  const getZoneCompliance = (zoneId: string): 'ideal' | 'acceptable' | 'forbidden' => {
    if (!activeRoom) return 'acceptable';
    if (activeRoom.idealZones.includes(zoneId)) return 'ideal';
    if (activeRoom.acceptableZones.includes(zoneId)) return 'acceptable';
    return 'forbidden';
  };

  const adjustAngle = (delta: number) => {
    setFacingAngle((prev) => (prev + delta + 360) % 360);
  };

  const handlePrint = () => {
    window.print();
  };

  const containerBg = isLight ? 'bg-[#FAF8F5] text-stone-900' : 'bg-[#1A0F0A] text-[#FFF7ED]';
  const cardBg = isLight
    ? 'bg-white border-amber-300 shadow-md text-stone-900'
    : 'bg-[#2D1B14] border-[#D4A72C]/70 shadow-xl text-[#FFF7ED]';

  const subtextClass = isLight ? 'text-stone-700' : 'text-[#E8D3A8]';
  const headingClass = isLight ? 'text-stone-950 font-black' : 'text-[#FFF7ED] font-black';

  return (
    <div
      className={`w-full ${
        fullPage ? 'min-h-[85vh] py-4' : 'rounded-3xl border-2 border-[#D4A72C] shadow-2xl p-4 sm:p-6 md:p-8'
      } ${containerBg} transition-colors duration-200 relative`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#D4A72C]/40 pb-4">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#E88A16] text-[#2D1B14] shadow-md animate-pulse">
                <Compass className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase font-serif tracking-widest text-[#E88A16] font-bold">
                Dynamic Magnetic Instrument · दिक्-साधन चक्रम्
              </span>
            </div>
            <h2 className={`font-['Cinzel_Decorative'] text-xl sm:text-2xl md:text-3xl ${headingClass}`}>
              Animated Vastu Compass & Spatial Matrix
            </h2>
            <p className={`font-['Marcellus'] text-xs sm:text-sm ${subtextClass}`}>
              Interactive live-swinging needle with physics damping. Drag the dial directly or select house orientation to inspect 16 Vastu zones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Auto-Tour Animated Play/Pause Button */}
            <button
              onClick={toggleAutoTour}
              className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isAutoTouring
                  ? 'bg-[#E88A16] text-[#2D1B14] border-[#6B1F1F] animate-pulse'
                  : isLight
                  ? 'bg-amber-100/80 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-[#2D1B14] text-[#E8D3A8] border-[#D4A72C]/60 hover:text-white'
              }`}
              title={isAutoTouring ? 'Pause 360° Animation Tour' : 'Play 360° Animated Zone Tour'}
            >
              {isAutoTouring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isAutoTouring ? 'Touring 360°' : 'Animate Tour'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Mechanical Compass Ticks' : 'Enable Compass Mechanical Ticks'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-[#E88A16] text-[#2D1B14] border-[#6B1F1F]'
                  : isLight
                  ? 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                  : 'bg-[#2D1B14] border-[#D4A72C]/60 text-[#E8D3A8] hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* View Mode Switcher */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 ${isLight ? 'bg-amber-100/70 border-amber-300' : 'bg-[#2D1B14] border-[#D4A72C]/50'}`}>
              <button
                onClick={() => setViewMode('chakra')}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'chakra'
                    ? 'bg-[#E88A16] text-[#2D1B14] shadow-xs'
                    : isLight
                    ? 'text-stone-700 hover:text-stone-900'
                    : 'text-[#E8D3A8] hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Chakra Dial</span>
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'matrix'
                    ? 'bg-[#E88A16] text-[#2D1B14] shadow-xs'
                    : isLight
                    ? 'text-stone-700 hover:text-stone-900'
                    : 'text-[#E8D3A8] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>House Matrix</span>
              </button>
            </div>

            {/* Print Action */}
            <button
              onClick={handlePrint}
              title="Print Compass Analysis Report"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                  : 'bg-[#2D1B14] border-[#D4A72C]/60 text-[#E8D3A8] hover:text-white'
              }`}
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button (if modal) */}
            {!fullPage && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-red-900/40 hover:bg-red-900 text-red-200 border border-red-700 transition-colors cursor-pointer"
                title="Close Compass"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Orientation & Quick Control Bar */}
        <div className={`p-4 rounded-2xl border-2 ${cardBg} space-y-4 text-left`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Facing Bearing Display */}
            <div className="space-y-1">
              <span className={`text-[11px] font-serif uppercase tracking-wider font-bold block ${isLight ? 'text-amber-800' : 'text-[#D4A72C]'}`}>
                Home Entrance Orientation / मुख्य द्वार अभिमुखता
              </span>
              <div className="flex items-center gap-3">
                <span className="font-['Cinzel_Decorative'] text-2xl sm:text-3xl font-black text-[#E88A16]">
                  {facingAngle}°
                </span>
                <span className={`text-sm sm:text-base font-serif font-bold px-3 py-1 rounded-lg border ${
                  isLight ? 'bg-amber-100 border-amber-300 text-amber-950' : 'bg-[#1A0F0A] border-[#D4A72C] text-[#FFF7ED]'
                }`}>
                  {getCardinalCode(facingAngle)}
                </span>
              </div>
            </div>

            {/* Fine Step Rotation Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => adjustAngle(-5)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300' : 'bg-[#1A0F0A] hover:bg-[#3D251C] text-[#E8D3A8] border-[#D4A72C]/60'
                }`}
                title="Rotate -5°"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>-5°</span>
              </button>
              <button
                onClick={() => adjustAngle(-1)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-serif font-bold transition-all cursor-pointer ${
                  isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300' : 'bg-[#1A0F0A] hover:bg-[#3D251C] text-[#E8D3A8] border-[#D4A72C]/60'
                }`}
                title="Rotate -1°"
              >
                -1°
              </button>
              <button
                onClick={() => setFacingAngle(0)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-serif font-bold transition-all cursor-pointer ${
                  facingAngle === 0
                    ? 'bg-[#0F5C55] text-white border-teal-400'
                    : isLight
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-[#1A0F0A] hover:bg-[#3D251C] text-[#D4A72C] border-[#D4A72C]/60'
                }`}
                title="Reset to True North (0°)"
              >
                Reset North (0°)
              </button>
              <button
                onClick={() => adjustAngle(1)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-serif font-bold transition-all cursor-pointer ${
                  isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300' : 'bg-[#1A0F0A] hover:bg-[#3D251C] text-[#E8D3A8] border-[#D4A72C]/60'
                }`}
                title="Rotate +1°"
              >
                +1°
              </button>
              <button
                onClick={() => adjustAngle(5)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300' : 'bg-[#1A0F0A] hover:bg-[#3D251C] text-[#E8D3A8] border-[#D4A72C]/60'
                }`}
                title="Rotate +5°"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>+5°</span>
              </button>

              {/* Live Device Sensor Button */}
              {sensorSupported && (
                <button
                  onClick={toggleDeviceSensor}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    sensorActive
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : isLight
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                      : 'bg-[#1A0F0A] hover:bg-[#3D251C] text-[#E8D3A8] border-[#D4A72C]/60'
                  }`}
                  title="Toggle Mobile Magnetic Sensor Compass"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{sensorActive ? 'Live Sensor: ON' : 'Phone Sensor'}</span>
                </button>
              )}
            </div>
          </div>

          {sensorMessage && (
            <div className="text-xs font-serif text-amber-700 dark:text-amber-300 italic pt-1">
              ✦ {sensorMessage}
            </div>
          )}

          {/* Continuous Angle Bearing Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs font-serif font-bold">
              <span className={isLight ? 'text-stone-600' : 'text-[#E8D3A8]/80'}>North (0°)</span>
              <span className={isLight ? 'text-stone-600' : 'text-[#E8D3A8]/80'}>East (90°)</span>
              <span className={isLight ? 'text-stone-600' : 'text-[#E8D3A8]/80'}>South (180°)</span>
              <span className={isLight ? 'text-stone-600' : 'text-[#E8D3A8]/80'}>West (270°)</span>
              <span className={isLight ? 'text-stone-600' : 'text-[#E8D3A8]/80'}>North (360°)</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={facingAngle}
              onChange={(e) => setFacingAngle(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-stone-300 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#E88A16]"
            />
          </div>

          {/* Quick Facing Direction Preset Buttons */}
          <div className="pt-2 border-t border-[#D4A72C]/30 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className={`text-xs font-serif uppercase tracking-wider font-bold mr-1 ${isLight ? 'text-stone-700' : 'text-[#D4A72C]'}`}>
              Quick Presets:
            </span>
            {FACING_PRESETS.map((preset) => {
              const isMatch = Math.abs(facingAngle - preset.angle) < 4;
              return (
                <button
                  key={preset.code}
                  onClick={() => setFacingAngle(preset.angle)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer font-bold ${
                    isMatch
                      ? 'bg-[#E88A16] text-[#2D1B14] shadow-md border-2 border-[#6B1F1F] scale-105'
                      : isLight
                      ? 'bg-amber-50 hover:bg-amber-100 text-stone-800 border border-amber-300'
                      : 'bg-[#1A0F0A] hover:bg-[#3D251C] text-[#E8D3A8] border border-[#D4A72C]/50'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Room Placement Suitability Checker */}
        <div className={`p-4 rounded-2xl border-2 ${cardBg} space-y-3 text-left`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-serif uppercase tracking-wider font-bold text-[#E88A16] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Vastu Room Placement Compliance Analyzer
              </span>
              <p className={`font-['Marcellus'] text-xs ${subtextClass}`}>
                Select a space or room to see auspicious, tolerable, and prohibited directions relative to current orientation.
              </p>
            </div>

            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className={`px-3 py-2 rounded-xl border-2 text-xs sm:text-sm font-serif font-bold cursor-pointer transition-colors shadow-sm ${
                isLight
                  ? 'bg-white border-amber-400 text-stone-900 focus:ring-2 focus:ring-amber-500'
                  : 'bg-[#1A0F0A] border-[#D4A72C] text-[#FFF7ED] focus:ring-2 focus:ring-[#E88A16]'
              }`}
            >
              {ROOM_COMPLIANCE_RULES.map((rule) => (
                <option key={rule.id} value={rule.id}>
                  {rule.label} ({rule.sanskritLabel})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Interactive Stage: Animated Compass on Left, Zone Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual Compass or Matrix Display */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
            {viewMode === 'chakra' ? (
              /* High-Fidelity Animated Vastu Chakra Compass Dial */
              <div
                ref={compassDialRef}
                onPointerDown={handlePointerDown}
                onWheel={handleWheel}
                className="relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-none group"
                title="Drag or touch anywhere around the dial to spin the compass in real-time"
              >
                {/* Outer Glow Halo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4A72C]/25 via-[#E88A16]/20 to-[#0F5C55]/25 blur-2xl pointer-events-none" />

                {/* Rotating SVG Compass Dial */}
                <svg
                  viewBox="0 0 460 460"
                  className="w-full h-full drop-shadow-2xl transition-transform ease-out"
                  style={{
                    transform: `rotate(${-needleAngle}deg)`,
                  }}
                >
                  <defs>
                    <radialGradient id="compassDialBg" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={isLight ? '#FFFDF8' : '#1A0F0A'} />
                      <stop offset="65%" stopColor={isLight ? '#F5EADB' : '#120703'} />
                      <stop offset="100%" stopColor={isLight ? '#E5D0B5' : '#080302'} />
                    </radialGradient>

                    <linearGradient id="brassBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="25%" stopColor="#FEF3C7" />
                      <stop offset="50%" stopColor="#D4A72C" />
                      <stop offset="75%" stopColor="#78350F" />
                      <stop offset="100%" stopColor="#B45309" />
                    </linearGradient>

                    <radialGradient id="pivotGemGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#FEF3C7" />
                      <stop offset="40%" stopColor="#DC2626" />
                      <stop offset="100%" stopColor="#7F1D1D" />
                    </radialGradient>
                  </defs>

                  {/* Heavy Outer Cast Brass Bezel Ring */}
                  <circle cx="230" cy="230" r="226" fill="url(#brassBezelGrad)" stroke="#78350F" strokeWidth="2" />
                  <circle cx="230" cy="230" r="218" fill="url(#compassDialBg)" stroke="#D4A72C" strokeWidth="3" />
                  <circle cx="230" cy="230" r="210" fill="none" stroke="#B94E2C" strokeWidth="1.5" strokeDasharray="5 3" />

                  {/* 16 Zone Wedges (22.5° each) */}
                  {VASTU_16_ZONES.map((zone) => {
                    const startAngleRad = ((zone.angleStart - 90) * Math.PI) / 180;
                    const endAngleRad = ((zone.angleEnd - 90) * Math.PI) / 180;
                    const rOuter = 208;
                    const rInner = 125;

                    const x1 = 230 + rOuter * Math.cos(startAngleRad);
                    const y1 = 230 + rOuter * Math.sin(startAngleRad);
                    const x2 = 230 + rOuter * Math.cos(endAngleRad);
                    const y2 = 230 + rOuter * Math.sin(endAngleRad);

                    const x3 = 230 + rInner * Math.cos(endAngleRad);
                    const y3 = 230 + rInner * Math.sin(endAngleRad);
                    const x4 = 230 + rInner * Math.cos(startAngleRad);
                    const y4 = 230 + rInner * Math.sin(startAngleRad);

                    const pathData = `
                      M ${x1} ${y1}
                      A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2}
                      L ${x3} ${y3}
                      A ${rInner} ${rInner} 0 0 0 ${x4} ${y4}
                      Z
                    `;

                    // Label midpoint
                    const midAngleRad = ((zone.angleCenter - 90) * Math.PI) / 180;
                    const rLabel = 170;
                    const lx = 230 + rLabel * Math.cos(midAngleRad);
                    const ly = 230 + rLabel * Math.sin(midAngleRad);

                    const compliance = getZoneCompliance(zone.id);
                    const isSelected = activeZoneId === zone.id;

                    let fillColor = isLight ? zone.lightBgHex : zone.darkBgHex;
                    let strokeColor = isLight ? zone.lightBorderHex : '#D4A72C';
                    let fillOpacity = 0.88;

                    if (compliance === 'ideal') {
                      fillColor = isLight ? '#DCFCE7' : '#064E3B';
                      strokeColor = '#10B981';
                      fillOpacity = 0.98;
                    } else if (compliance === 'forbidden') {
                      fillColor = isLight ? '#FEE2E2' : '#7F1D1D';
                      strokeColor = '#EF4444';
                      fillOpacity = 0.92;
                    } else if (compliance === 'acceptable') {
                      fillColor = isLight ? '#FEF3C7' : '#78350F';
                      strokeColor = '#F59E0B';
                    }

                    return (
                      <g
                        key={zone.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveZoneId(zone.id);
                        }}
                        className="cursor-pointer transition-all duration-200 hover:opacity-100"
                      >
                        <title>{`${zone.name} (${zone.code}): ${zone.significance}`}</title>
                        <path
                          d={pathData}
                          fill={fillColor}
                          fillOpacity={fillOpacity}
                          stroke={isSelected ? '#E88A16' : strokeColor}
                          strokeWidth={isSelected ? '3.5' : '1'}
                          className="hover:stroke-[#E88A16] hover:stroke-width-2"
                        />
                        {/* Zone Code Label */}
                        <text
                          x={lx}
                          y={ly}
                          fill={isLight ? '#1C1917' : '#FFF7ED'}
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="Cinzel, serif"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${zone.angleCenter}, ${lx}, ${ly})`}
                        >
                          {zone.code}
                        </text>
                      </g>
                    );
                  })}

                  {/* Degree Tick Marks Around Outer Perimeter */}
                  {[...Array(72)].map((_, i) => {
                    const deg = i * 5;
                    const rad = ((deg - 90) * Math.PI) / 180;
                    const isMajor = deg % 90 === 0;
                    const isSemi = deg % 45 === 0;
                    const isTen = deg % 10 === 0;
                    const r1 = 226;
                    const r2 = isMajor ? 208 : isSemi ? 212 : isTen ? 216 : 220;

                    const tx1 = 230 + r1 * Math.cos(rad);
                    const ty1 = 230 + r1 * Math.sin(rad);
                    const tx2 = 230 + r2 * Math.cos(rad);
                    const ty2 = 230 + r2 * Math.sin(rad);

                    return (
                      <line
                        key={`tick-${deg}`}
                        x1={tx1}
                        y1={ty1}
                        x2={tx2}
                        y2={ty2}
                        stroke={isMajor ? '#991B1B' : isSemi ? '#D4A72C' : '#A16207'}
                        strokeWidth={isMajor ? 2.5 : isSemi ? 1.5 : 0.8}
                      />
                    );
                  })}

                  {/* Inner Ring: Brahmasthan (Cosmic Heart Hub) */}
                  <circle
                    cx="230"
                    cy="230"
                    r="124"
                    fill={isLight ? '#FFFDF8' : '#140A06'}
                    stroke="#D4A72C"
                    strokeWidth="3"
                  />
                  <circle
                    cx="230"
                    cy="230"
                    r="110"
                    fill="none"
                    stroke="#E88A16"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                  />

                  {/* 8-Petal Sacred Lotus Geometry in Center */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                    <circle
                      key={`petal-${ang}`}
                      cx={230 + 36 * Math.cos(((ang - 90) * Math.PI) / 180)}
                      cy={230 + 36 * Math.sin(((ang - 90) * Math.PI) / 180)}
                      r="18"
                      fill={isLight ? '#FDE68A' : '#78350F'}
                      fillOpacity="0.45"
                      stroke="#D4A72C"
                      strokeWidth="1.2"
                    />
                  ))}

                  {/* Center Brahmasthan Text */}
                  <circle cx="230" cy="230" r="44" fill={isLight ? '#FFFDF8' : '#2D1B14'} stroke="#D4A72C" strokeWidth="2" />
                  <text
                    x="230"
                    y="223"
                    fill={isLight ? '#9A3412' : '#FDE68A'}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="Yatra One, cursive"
                    textAnchor="middle"
                  >
                    ब्रह्मस्थान
                  </text>
                  <text
                    x="230"
                    y="238"
                    fill={isLight ? '#44403C' : '#E8D3A8'}
                    fontSize="8.5"
                    fontFamily="Marcellus, serif"
                    textAnchor="middle"
                  >
                    Cosmic Center
                  </text>
                </svg>

                {/* ANIMATED 3D FACETED MAGNETIC NEEDLE (Points Steadfastly to Magnetic North) */}
                <div
                  className="absolute inset-0 pointer-events-none flex items-center justify-center"
                  style={{
                    filter: 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.45))',
                  }}
                >
                  <svg viewBox="0 0 460 460" className="w-full h-full">
                    {/* NORTH POINTER (Crimson/Vermilion with Golden 3D Bevel) */}
                    <polygon
                      points="230,30 220,230 230,230"
                      fill="#DC2626"
                      stroke="#991B1B"
                      strokeWidth="0.8"
                    />
                    <polygon
                      points="230,30 240,230 230,230"
                      fill="#EF4444"
                      stroke="#991B1B"
                      strokeWidth="0.8"
                    />
                    {/* North Glowing Arrowhead Crest */}
                    <polygon
                      points="230,22 224,40 230,34 236,40"
                      fill="#F59E0B"
                      stroke="#D4A72C"
                      strokeWidth="1"
                    />
                    <text
                      x="230"
                      y="54"
                      fill="#FFFFFF"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="Cinzel, serif"
                      textAnchor="middle"
                    >
                      N
                    </text>

                    {/* SOUTH POINTER (Silver-Platinum Slate with Bevel) */}
                    <polygon
                      points="230,430 220,230 230,230"
                      fill="#475569"
                      stroke="#334155"
                      strokeWidth="0.8"
                    />
                    <polygon
                      points="230,430 240,230 230,230"
                      fill="#94A3B8"
                      stroke="#64748B"
                      strokeWidth="0.8"
                    />
                    <text
                      x="230"
                      y="415"
                      fill="#CBD5E1"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="Cinzel, serif"
                      textAnchor="middle"
                    >
                      S
                    </text>

                    {/* Central Brass Pivot Cap with Glowing Ruby Gem */}
                    <circle cx="230" cy="230" r="16" fill="url(#brassBezelGrad)" stroke="#78350F" strokeWidth="2" />
                    <circle cx="230" cy="230" r="11" fill="url(#pivotGemGrad)" stroke="#FEF3C7" strokeWidth="1" />
                    <circle cx="227" cy="227" r="3" fill="#FFFFFF" fillOpacity="0.8" />
                  </svg>
                </div>

                {/* Subtle Interactive Instruction Pill */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[11px] font-serif text-[#D4A72C] border border-[#D4A72C]/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  ↺ Touch or drag dial to spin
                </div>
              </div>
            ) : (
              /* 3x3 Vastu Purusha House Grid Matrix */
              <div className="w-full max-w-md aspect-square p-3 rounded-3xl border-2 border-[#D4A72C] bg-vastu-grid relative flex flex-col justify-between shadow-2xl">
                <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full">
                  {[
                    { id: 'NW', label: 'NW · Vayavya', sub: 'Air · Guests', element: 'Air' },
                    { id: 'N', label: 'N · Uttara', sub: 'Water · Kuber', element: 'Water' },
                    { id: 'NE', label: 'NE · Ishanya', sub: 'Water · Mandir', element: 'Water' },
                    { id: 'W', label: 'W · Pashchima', sub: 'Space · Gains', element: 'Space' },
                    { id: 'CENTER', label: 'Brahmasthan', sub: 'Open Center', element: 'Space' },
                    { id: 'E', label: 'E · Purva', sub: 'Air · Indra / Sun', element: 'Air' },
                    { id: 'SW', label: 'SW · Nairutya', sub: 'Earth · Master Bed', element: 'Earth' },
                    { id: 'S', label: 'S · Dakshina', sub: 'Fire · Yama / Rest', element: 'Fire' },
                    { id: 'SE', label: 'SE · Agneya', sub: 'Fire · Kitchen', element: 'Fire' },
                  ].map((cell) => {
                    const isCenter = cell.id === 'CENTER';
                    const compliance = isCenter ? 'ideal' : getZoneCompliance(cell.id);
                    const isSelected = activeZoneId === cell.id;

                    let bgClass = isLight ? 'bg-amber-50 text-stone-900 border-amber-300' : 'bg-[#2D1B14] text-[#FFF7ED] border-[#D4A72C]/60';
                    if (compliance === 'ideal') {
                      bgClass = isLight ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold' : 'bg-emerald-950/80 text-emerald-200 border-emerald-500 font-bold';
                    } else if (compliance === 'forbidden') {
                      bgClass = isLight ? 'bg-rose-100 text-rose-950 border-rose-400 font-bold' : 'bg-rose-950/80 text-rose-200 border-rose-500 font-bold';
                    } else if (compliance === 'acceptable') {
                      bgClass = isLight ? 'bg-amber-100 text-amber-950 border-amber-400 font-bold' : 'bg-amber-950/80 text-amber-200 border-amber-500 font-bold';
                    }

                    return (
                      <button
                        key={cell.id}
                        onClick={() => !isCenter && setActiveZoneId(cell.id)}
                        className={`p-2 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left relative overflow-hidden ${bgClass} ${
                          isSelected ? 'ring-4 ring-[#E88A16] scale-102 shadow-lg' : 'hover:scale-101'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-['Cinzel',serif] font-bold">{cell.label}</span>
                          {!isCenter && compliance === 'ideal' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                          {!isCenter && compliance === 'forbidden' && <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                          {!isCenter && compliance === 'acceptable' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        </div>
                        <span className="text-[10px] font-serif truncate mt-1 opacity-90">{cell.sub}</span>
                        <span className="text-[9px] font-serif font-bold uppercase tracking-wider text-right block pt-1 opacity-70">
                          {cell.element}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Legend Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-serif font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" /> Auspicious / Highly Compliant
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Tolerable with Remedies
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Prohibited / Severe Dosha
              </span>
            </div>
          </div>

          {/* Right Column: Active Zone Deep Dive & Remedy Drawer */}
          <div className="lg:col-span-5 space-y-4 text-left">
            {/* Active Selected Zone Card */}
            <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all shadow-xl space-y-4 ${cardBg}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#D4A72C]/40 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-serif font-bold px-2 py-0.5 rounded bg-[#E88A16] text-[#2D1B14] border border-[#6B1F1F]">
                      {activeZone.english} ({activeZone.code})
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400">
                      {activeZone.angleStart}° – {activeZone.angleEnd}°
                    </span>
                  </div>
                  <h3 className="font-['Cinzel_Decorative'] text-xl sm:text-2xl font-black mt-1">
                    {activeZone.name}
                  </h3>
                  <div className="text-sm font-['Yatra_One'] text-[#E88A16]">
                    ॥ {activeZone.sanskrit} ॥
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-xs font-serif font-bold text-[#0F5C55] dark:text-teal-400 block">
                    Element: {activeZone.element} ({activeZone.elementSanskrit})
                  </span>
                  <span className="text-xs font-serif text-stone-600 dark:text-[#E8D3A8] block">
                    Deity: {activeZone.deity}
                  </span>
                </div>
              </div>

              {/* Shastric Shloka Quotation */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-[#1A0F0A] border-l-4 border-[#E88A16] text-xs font-serif italic text-amber-900 dark:text-[#FDE68A] leading-relaxed">
                {activeZone.classicalQuote}
              </div>

              {/* Significance & Best Uses */}
              <div className="space-y-2">
                <span className="text-xs font-serif uppercase tracking-wider font-bold block text-stone-700 dark:text-[#D4A72C]">
                  Significance & Governed Life Facet
                </span>
                <p className={`font-['Marcellus'] text-xs sm:text-sm leading-relaxed ${subtextClass}`}>
                  {activeZone.significance}
                </p>
              </div>

              {/* Recommended Activities vs Prohibited Activities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 space-y-1">
                  <span className="text-[11px] font-serif uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-300 block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ideal Placements
                  </span>
                  <p className="text-xs font-['Marcellus'] text-emerald-900 dark:text-emerald-100 leading-relaxed">
                    {activeZone.idealRooms.join(', ')}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700/60 space-y-1">
                  <span className="text-[11px] font-serif uppercase tracking-wider font-bold text-rose-800 dark:text-rose-300 block flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Strictly Avoid
                  </span>
                  <p className="text-xs font-['Marcellus'] text-rose-900 dark:text-rose-100 leading-relaxed">
                    {activeZone.prohibitedRooms.join(', ')}
                  </p>
                </div>
              </div>

              {/* Classical Remedy */}
              <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-[#1C120C] border border-amber-300/60 dark:border-[#D4A72C]/40 space-y-1">
                <span className="text-[11px] font-serif uppercase tracking-wider font-bold text-amber-800 dark:text-[#E88A16] block">
                  Canonical Remedy if Flawed (शास्त्रोक्त समाधानम्)
                </span>
                <p className="text-xs font-['Marcellus'] text-stone-800 dark:text-[#E8D3A8] leading-relaxed">
                  {activeZone.remedy}
                </p>
              </div>
            </div>

            {/* Room Suitability Verdict Card for Active Room */}
            {activeRoom && (
              <div className={`p-4 rounded-2xl border-2 ${cardBg} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif uppercase tracking-wider font-bold text-[#E88A16]">
                    Room Analysis: {activeRoom.label}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-serif font-bold uppercase ${
                      getZoneCompliance(activeZone.id) === 'ideal'
                        ? 'bg-emerald-600 text-white'
                        : getZoneCompliance(activeZone.id) === 'acceptable'
                        ? 'bg-amber-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {getZoneCompliance(activeZone.id) === 'ideal'
                      ? '✦ Highly Auspicious'
                      : getZoneCompliance(activeZone.id) === 'acceptable'
                      ? '✦ Tolerable'
                      : '⚠ Prohibited Zone'}
                  </span>
                </div>
                <p className={`font-['Marcellus'] text-xs leading-relaxed ${subtextClass}`}>
                  {activeRoom.rationale}
                </p>
                <div className="pt-2 text-[11px] font-serif text-stone-600 dark:text-[#E8D3A8]/80">
                  <strong>Canonical Advice:</strong> {activeRoom.remedyIfAfflicted}
                </div>
              </div>
            )}

            {/* Consultation Prompt */}
            {onNavigateContact && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={onNavigateContact}
                  className="px-5 py-2.5 rounded-xl bg-[#0F5C55] hover:bg-[#167A68] text-[#FFF7ED] font-serif text-xs font-bold border border-[#D4A72C] transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4A72C]" />
                  <span>Request Full Architectural Diagnosis</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
