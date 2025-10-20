import AppLayout from '@/layouts/app-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem, type Student } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { IdCard, User, CheckCircle, Filter, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface IDTemplatesProps {
    students: Student[];
    flash?: { success?: string };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'ID Templates',
        href: '/id-templates',
    },
];

export default function IDTemplates() {
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [selectedLogo, setSelectedLogo] = useState<string>('UP logo.png');
    const [templateOrientation, setTemplateOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
    const [rotationX, setRotationX] = useState(0);
    const [rotationY, setRotationY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    
    const { students, flash } = usePage<IDTemplatesProps>().props;
    
    const selectedStudent = selectedStudentId 
        ? students.find(student => student.id === selectedStudentId)
        : null;

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
        e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;
        
        // Improved sensitivity and constraints
        setRotationY(prev => {
            const newRotation = prev + deltaX * 0.7;
            // Allow full 360 rotation but smooth it
            return newRotation;
        });
        setRotationX(prev => {
            const newRotation = prev - deltaY * 0.7;
            // Constrain X rotation to prevent flipping upside down
            return Math.max(-60, Math.min(60, newRotation));
        });
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch support for mobile devices
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setLastMousePos({ x: touch.clientX, y: touch.clientY });
        e.preventDefault();
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastMousePos.x;
        const deltaY = touch.clientY - lastMousePos.y;
        
        setRotationY(prev => prev + deltaX * 0.7);
        setRotationX(prev => {
            const newRotation = prev - deltaY * 0.7;
            return Math.max(-60, Math.min(60, newRotation));
        });
        setLastMousePos({ x: touch.clientX, y: touch.clientY });
        e.preventDefault();
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const resetRotation = () => {
        setRotationX(0);
        setRotationY(0);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ID Templates" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">ID Templates</h1>
                        <p className="text-muted-foreground">
                            View and customize digital student identification templates.
                        </p>
                    </div>
                    
                    {/* Student Filter Dropdown */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <label htmlFor="studentFilter" className="text-sm font-medium">
                                Filter by Student:
                            </label>
                        </div>
                        <div className="w-64">
                            <Select 
                                value={selectedStudentId?.toString() || "all"} 
                                onValueChange={(value) => {
                                    setSelectedStudentId(value === "all" ? null : parseInt(value));
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a student" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Students</SelectItem>
                                    {students.map((student) => (
                                        <SelectItem key={student.id} value={student.id.toString()}>
                                            {student.full_name} ({student.student_number})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Logo Selection Dropdown */}
                        <div className="flex items-center gap-2">
                            <IdCard className="h-4 w-4 text-muted-foreground" />
                            <label htmlFor="logoFilter" className="text-sm font-medium">
                                Logo:
                            </label>
                        </div>
                        <div className="w-48">
                            <Select 
                                value={selectedLogo} 
                                onValueChange={setSelectedLogo}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a logo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UP logo.png">UP Logo</SelectItem>
                                    <SelectItem value="UP-ITDC.jpg">UP-ITDC</SelectItem>
                                    <SelectItem value="UP-ITDX.jpg">UP-ITDX</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Template Orientation Dropdown */}
                        <div className="flex items-center gap-2">
                            <RotateCcw className="h-4 w-4 text-muted-foreground" />
                            <label htmlFor="templateFilter" className="text-sm font-medium">
                                Template:
                            </label>
                        </div>
                        <div className="w-40">
                            <Select 
                                value={templateOrientation} 
                                onValueChange={(value: 'horizontal' | 'vertical') => setTemplateOrientation(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="horizontal">Horizontal</SelectItem>
                                    <SelectItem value="vertical">Vertical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Digital ID Card</CardTitle>
                                <CardDescription>
                                    Drag the card to rotate and view both front and back sides
                                </CardDescription>
                            </div>
                            {selectedStudent && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={resetRotation}
                                    className="flex items-center gap-2"
                                    title="Reset card rotation"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center p-6">
                        {selectedStudent ? (
                            <div 
                                className="relative cursor-grab active:cursor-grabbing select-none"
                                style={{ 
                                    perspective: '1500px',
                                    perspectiveOrigin: 'center center'
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <div 
                                    className={`relative transform-gpu transition-all ease-out ${
                                        templateOrientation === 'horizontal' ? 'w-[600px] h-96' : 'w-80 h-[500px]'
                                    }`}
                                    style={{ 
                                        transformStyle: 'preserve-3d',
                                        transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                                    }}
                                >
                                    {/* Front Card */}
                                    <div 
                                        className={`absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-2xl border border-gray-300 ${
                                            templateOrientation === 'horizontal' ? 'p-5' : 'p-3'
                                        }`}
                                        style={{ 
                                            backfaceVisibility: 'hidden',
                                            transform: 'translateZ(8px)',
                                            WebkitBackfaceVisibility: 'hidden'
                                        }}
                                    >
                                        <div className="h-full flex flex-col overflow-hidden">
                                            {/* Header with logos and university name */}
                                            <div className={`${templateOrientation === 'horizontal' ? 'flex items-center justify-between text-white p-2 rounded mb-3' : 'text-center text-white p-2 rounded mb-3'}`} style={{ background: 'linear-gradient(135deg, #7b1113 0%, #a01619 100%)' }}>
                                                <div className={`rounded-full bg-white border-2 border-red-200 flex items-center justify-center overflow-hidden shadow-sm ${
                                                    templateOrientation === 'horizontal' ? 'w-10 h-10' : 'w-12 h-12 mx-auto mb-1'
                                                }`}>
                                                    <img 
                                                        src={`/${selectedLogo}`} 
                                                        alt="Selected Logo" 
                                                        className={`object-contain ${templateOrientation === 'horizontal' ? 'w-6 h-6' : 'w-8 h-8'}`}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                                <div className={`text-center ${templateOrientation === 'horizontal' ? 'flex-1 mx-2' : ''}`}>
                                                    <h1 className={`font-bold mb-0.5 leading-tight text-white ${templateOrientation === 'horizontal' ? 'text-sm' : 'text-sm'}`}>
                                                        UNIVERSITY OF THE PHILIPPINES
                                                    </h1>
                                                    <p className={`font-semibold text-white ${templateOrientation === 'horizontal' ? 'text-xs' : 'text-xs'}`}>
                                                        DILIMAN CAMPUS
                                                    </p>
                                                    <div className={`w-full h-px bg-white bg-opacity-50 mt-1 ${templateOrientation === 'vertical' ? 'mx-auto' : ''}`}></div>
                                                </div>
                                                {templateOrientation === 'horizontal' && (
                                                    <div className="text-right text-xs text-white">
                                                        <p>OFFICIAL ID</p>
                                                        <p className="text-yellow-300">2024-2025</p>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Main content area */}
                                            <div className={`flex-1 flex ${templateOrientation === 'horizontal' ? 'items-start justify-between gap-4' : 'flex-col items-center space-y-3'}`}>
                                                {/* Student photo - Move to top in vertical layout */}
                                                {templateOrientation === 'vertical' && (
                                                    <div className="relative">
                                                        <div className="w-24 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-lg border-2 border-slate-300 overflow-hidden relative">
                                                            {selectedStudent.id_image && (
                                                                <img 
                                                                    src={`/storage/${selectedStudent.id_image}`} 
                                                                    alt="Student ID" 
                                                                    className="absolute inset-0 w-full h-full object-cover z-10"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                    }}
                                                                />
                                                            )}
                                                            <div className="absolute inset-0 flex items-center justify-center z-0">
                                                                <User className="h-12 w-12 text-slate-400" />
                                                            </div>
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className={`${templateOrientation === 'horizontal' ? 'flex-1 min-w-0 bg-slate-50 p-3 rounded-lg border border-slate-200' : 'w-full bg-slate-50 p-3 rounded-lg border border-slate-200 text-center'}`}>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                                                            <h2 className={`font-bold text-slate-900 uppercase tracking-wide leading-tight ${templateOrientation === 'horizontal' ? 'text-lg' : 'text-lg'}`}>
                                                                {selectedStudent.full_name}
                                                            </h2>
                                                        </div>
                                                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                                            <div>
                                                                <label className="text-xs font-semibold text-slate-500 uppercase">Student ID</label>
                                                                <p className={`font-bold ${templateOrientation === 'horizontal' ? 'text-base' : 'text-base'}`} style={{ color: '#7b1113' }}>
                                                                    {selectedStudent.student_number}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                                                                <div className="flex items-center gap-1">
                                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                    <span className="text-xs font-medium text-green-700">ACTIVE</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-semibold text-slate-500 uppercase">Program</label>
                                                            <p className={`text-slate-700 font-medium ${templateOrientation === 'horizontal' ? 'text-sm' : 'text-sm'}`}>
                                                                {selectedStudent.program}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Academic info in professional cards */}
                                                        <div className="grid grid-cols-2 gap-1.5 mt-2">
                                                            <div className="bg-red-50 p-1.5 rounded border border-red-200">
                                                                <label className="text-xs font-semibold uppercase" style={{ color: '#7b1113' }}>Semester</label>
                                                                <p className="text-xs font-bold" style={{ color: '#7b1113' }}>2nd SEM</p>
                                                            </div>
                                                            <div className="bg-amber-50 p-1.5 rounded border border-amber-200">
                                                                <label className="text-xs font-semibold text-amber-600 uppercase">A.Y.</label>
                                                                <p className="text-xs font-bold text-amber-900">2024-2025</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-slate-100 px-2 py-1.5 rounded border border-slate-300 text-center mt-2">
                                                            <p className="text-xs font-bold text-slate-700">
                                                                ID: #{selectedStudent.id.toString().padStart(8, '0')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Student photo for horizontal layout */}
                                                {templateOrientation === 'horizontal' && (
                                                    <div className="relative flex-shrink-0">
                                                        <div className="w-24 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-lg border-2 border-slate-300 overflow-hidden relative">
                                                            {selectedStudent.id_image && (
                                                                <img 
                                                                    src={`/storage/${selectedStudent.id_image}`} 
                                                                    alt="Student ID" 
                                                                    className="absolute inset-0 w-full h-full object-cover z-10"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                    }}
                                                                />
                                                            )}
                                                            <div className="absolute inset-0 flex items-center justify-center z-0">
                                                                <User className="h-10 w-10 text-slate-400" />
                                                            </div>
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Back Card */}
                                    <div 
                                        className={`absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg text-slate-800 shadow-2xl border border-slate-300 ${
                                            templateOrientation === 'horizontal' ? 'p-5' : 'p-3'
                                        }`}
                                        style={{ 
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg) translateZ(8px)',
                                            WebkitBackfaceVisibility: 'hidden'
                                        }}
                                    >
                                        <div className={`h-full flex flex-col justify-between overflow-hidden ${templateOrientation === 'horizontal' ? 'text-base' : 'text-sm'}`}>
                                            {/* Professional Header */}
                                            <div className={`bg-gradient-to-r from-slate-700 to-slate-600 text-white p-2 rounded mb-3`}>
                                                <div className="text-center">
                                                    <h3 className={`font-bold ${templateOrientation === 'horizontal' ? 'text-sm' : 'text-xs'}`}>
                                                        UNIVERSITY OF THE PHILIPPINES
                                                    </h3>
                                                    <p className={`text-slate-200 ${templateOrientation === 'horizontal' ? 'text-xs' : 'text-xs'}`}>
                                                        Official Student Identification
                                                    </p>
                                                    <div className="w-full h-px bg-slate-400 mt-1"></div>
                                                </div>
                                            </div>
                                            
                                            <div className={`flex-1 flex flex-col justify-between ${templateOrientation === 'horizontal' ? 'py-2' : 'py-2'}`}>
                                                <div className={`${templateOrientation === 'horizontal' ? 'flex justify-between items-start gap-4' : 'space-y-3'}`}>
                                                    <div className={`space-y-2 ${templateOrientation === 'horizontal' ? 'flex-1' : 'w-full'}`}>
                                                        {/* Professional Info Cards */}
                                                        <div className="bg-red-50 p-2 rounded-lg border border-red-200 shadow-sm">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <p className={`font-semibold ${templateOrientation === 'horizontal' ? 'text-sm' : 'text-xs'}`} style={{ color: '#7b1113' }}>
                                                                        VALIDITY PERIOD
                                                                    </p>
                                                                    <p className={`font-bold ${templateOrientation === 'horizontal' ? 'text-base' : 'text-sm'}`} style={{ color: '#7b1113' }}>
                                                                        Dec 31, 2025
                                                                    </p>
                                                                </div>
                                                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7b1113' }}>
                                                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 shadow-sm">
                                                            <p className={`font-semibold text-slate-600 ${templateOrientation === 'horizontal' ? 'text-sm' : 'text-xs'}`}>
                                                                EMERGENCY CONTACT
                                                            </p>
                                                            <p className={`font-medium text-slate-800 ${templateOrientation === 'horizontal' ? 'text-sm break-all' : 'text-xs break-all'}`}>
                                                                {selectedStudent.email}
                                                            </p>
                                                        </div>
                                                        
                                                        {templateOrientation === 'vertical' && (
                                                            <div className="bg-green-50 p-2 rounded-lg border border-green-200 shadow-sm">
                                                                <p className="font-semibold text-green-600 text-xs">COLLEGE/UNIT</p>
                                                                <p className="text-xs font-bold text-green-800">{selectedStudent.college}</p>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Security Features */}
                                                        <div className="bg-amber-50 p-1.5 rounded border border-amber-200">
                                                            <p className={`font-semibold text-amber-700 ${templateOrientation === 'horizontal' ? 'text-xs' : 'text-xs'}`}>
                                                                SECURITY FEATURES: Hologram, RFID, Barcode
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Enhanced QR Code with frame */}
                                                    <div className={`flex-shrink-0 ${templateOrientation === 'horizontal' ? '' : 'mx-auto'}`}>
                                                        <div className="bg-white p-2 rounded-lg shadow-lg border-2 border-slate-300">
                                                            <div className={`bg-slate-900 flex items-center justify-center rounded ${
                                                                templateOrientation === 'horizontal' ? 'w-20 h-20' : 'w-16 h-16'
                                                            }`}>
                                                                <div className={`bg-white relative ${templateOrientation === 'horizontal' ? 'w-16 h-16' : 'w-12 h-12'}`}>
                                                                    <div className="grid grid-cols-8 gap-0 w-full h-full">
                                                                        {Array.from({ length: 64 }, (_, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className={`${
                                                                                    Math.random() > 0.5 ? 'bg-slate-900' : 'bg-white'
                                                                                }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="text-center text-xs text-slate-600 mt-1">QR CODE</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Professional Signature Section */}
                                                <div className={`space-y-2 mt-4 ${templateOrientation === 'vertical' ? 'mt-3' : ''}`}>
                                                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                                                        <p className={`font-semibold text-slate-600 mb-2 ${templateOrientation === 'horizontal' ? 'text-sm' : 'text-xs'}`}>
                                                            AUTHORIZED SIGNATURE:
                                                        </p>
                                                        <div className={`border-b-2 border-slate-300 relative ${templateOrientation === 'horizontal' ? 'h-8' : 'h-6'}`}>
                                                            <div className={`absolute bottom-1 left-0 font-cursive text-slate-700 truncate ${
                                                                templateOrientation === 'horizontal' ? 'text-base' : 'text-sm'
                                                            }`}>
                                                                {selectedStudent.full_name.split(' ')[0]} {selectedStudent.full_name.split(' ').slice(-1)[0]}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className={`font-semibold text-slate-600 ${templateOrientation === 'horizontal' ? 'text-sm' : 'text-xs'}`}>
                                                                ISSUED BY:
                                                            </p>
                                                            <p className={`font-bold text-slate-800 ${templateOrientation === 'horizontal' ? 'text-sm' : 'text-xs'}`}>
                                                                Office of the University Registrar
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`text-slate-500 ${templateOrientation === 'horizontal' ? 'text-sm' : 'text-xs'}`}>
                                                                {new Date().toLocaleDateString('en-US', { 
                                                                    month: 'short', 
                                                                    day: 'numeric', 
                                                                    year: 'numeric' 
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Professional Footer */}
                                            <div className={`bg-slate-100 text-center border-t border-slate-300 p-2 rounded-b-lg -mx-4 -mb-4 ${templateOrientation === 'horizontal' ? '-mx-6 -mb-6' : ''}`}>
                                                <p className={`text-slate-600 leading-tight font-medium ${templateOrientation === 'horizontal' ? 'text-sm' : 'text-xs'}`}>
                                                    PROPERTY OF UP • IF FOUND, RETURN TO UNIVERSITY REGISTRAR
                                                </p>
                                                <p className={`text-slate-500 ${templateOrientation === 'horizontal' ? 'text-xs' : 'text-xs'}`}>
                                                    This card remains property of the University at all times
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Card thickness effect */}
                                    <div 
                                        className="absolute inset-0 rounded-lg"
                                        style={{ 
                                            background: 'linear-gradient(135deg, #7b1113 0%, #a01619 100%)',
                                            transform: 'translateZ(-8px)',
                                            zIndex: -1
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    Please select a student from the filter above to view their ID card.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}