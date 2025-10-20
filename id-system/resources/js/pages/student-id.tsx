import AppLayout from '@/layouts/app-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { student_id } from '@/routes';
import { type BreadcrumbItem, type Student } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { IdCard, User, CheckCircle, Filter, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface StudentIDProps {
    students: Student[];
    flash?: { success?: string };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student ID',
        href: student_id().url,
    },
];

export default function StudentId() {
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [rotationX, setRotationX] = useState(0);
    const [rotationY, setRotationY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    
    const { students, flash } = usePage<StudentIDProps>().props;
    
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
            <Head title="Student ID" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Viewing</h1>
                        <p className="text-muted-foreground">
                            View your digital student identification and personal information.
                        </p>
                    </div>
                    
                    {/* Student Filter Dropdown */}
                    <div className="flex items-center gap-4">
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
                                    if (value === "all") {
                                        setActiveTab("profile");
                                    }
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

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="id-card" className="flex items-center gap-2" disabled={!selectedStudent}>
                            <IdCard className="h-4 w-4" />
                            Digital ID
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Profile</CardTitle>
                                <CardDescription>
                                    View and manage your personal and academic information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedStudent ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Student Number
                                            </label>
                                            <p className="text-sm">{selectedStudent.student_number}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Full Name
                                            </label>
                                            <p className="text-sm">{selectedStudent.full_name}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Program
                                            </label>
                                            <p className="text-sm">{selectedStudent.program}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Year Level
                                            </label>
                                            <p className="text-sm">{selectedStudent.year_level}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Email
                                            </label>
                                            <p className="text-sm">{selectedStudent.email}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                College
                                            </label>
                                            <p className="text-sm">{selectedStudent.college}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">
                                            {students.length > 0 
                                                ? "Please select a student from the filter above to view their profile."
                                                : "No students found. Add a new student using the Add button."
                                            }
                                        </p>
                                    </div>
                                )}
                                <div className="pt-4">
                                    <Button variant="outline" disabled={!selectedStudent}>
                                        Edit Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="id-card" className="space-y-6">
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
                                            className="relative w-[500px] h-80 transform-gpu transition-transform ease-out"
                                            style={{ 
                                                transformStyle: 'preserve-3d',
                                                transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                                                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                                            }}
                                        >
                                            {/* Front Card */}
                                            <div 
                                                className="absolute inset-0 bg-white rounded-lg p-6 shadow-2xl border-2"
                                                style={{ 
                                                    backfaceVisibility: 'hidden',
                                                    transform: 'translateZ(8px)',
                                                    WebkitBackfaceVisibility: 'hidden'
                                                }}
                                            >
                                                <div className="h-full flex flex-col">
                                                    {/* Header with logos and university name */}
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="w-16 h-16 flex items-center justify-center">
                                                            <img 
                                                                src="/UP logo.png" 
                                                                alt="UP Logo" 
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="text-center flex-1 mx-3">
                                                            <h1 className="text-lg font-bold text-red-800 mb-1 leading-tight">University of the Philippines</h1>
                                                            <p className="text-base font-semibold text-red-700">Diliman</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Main content area */}
                                                    <div className="flex-1 flex items-start justify-between">
                                                        <div className="flex-1 space-y-3 pt-2">
                                                            <div>
                                                                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide leading-tight">{selectedStudent.full_name}</h2>
                                                            </div>
                                                            <div>
                                                                <p className="text-lg font-bold text-gray-800">{selectedStudent.student_number}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-base text-gray-700 font-medium">{selectedStudent.program}</p>
                                                            </div>
                                                            
                                                            {/* Academic year and semester info */}
                                                            <div className="mt-4 space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                                                        2nd Semester
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-base font-bold text-blue-900">AY 2024-2025</span>
                                                                    <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center">
                                                                        <IdCard className="h-3 w-3 text-white" />
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs font-bold text-green-700">#0{selectedStudent.id.toString().padStart(5, '0')}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Student photo */}
                                                        <div className="w-24 h-32 bg-red-600 rounded flex items-center justify-center ml-4 shadow-lg border-2 border-red-700 overflow-hidden relative">
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
                                                                <User className="h-12 w-12 text-red-200" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Back Card */}
                                            <div 
                                                className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 text-gray-800 shadow-2xl border"
                                                style={{ 
                                                    backfaceVisibility: 'hidden',
                                                    transform: 'rotateY(180deg) translateZ(8px)',
                                                    WebkitBackfaceVisibility: 'hidden'
                                                }}
                                            >
                                                <div className="h-full flex flex-col justify-between text-base overflow-hidden">
                                                    <div className="text-center border-b border-gray-300 pb-3">
                                                        <h3 className="text-base font-bold text-gray-700">UNIVERSITY OF THE PHILIPPINES</h3>
                                                        <p className="text-base text-gray-600">Student Identification Card</p>
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between py-4">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex-1 space-y-3">
                                                                <div>
                                                                    <p className="text-base font-medium text-gray-600">Valid Until:</p>
                                                                    <p className="text-base font-semibold">Dec 2025</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-base font-medium text-gray-600">Contact:</p>
                                                                    <p className="text-base truncate">{selectedStudent.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="w-20 h-20 bg-black flex items-center justify-center rounded flex-shrink-0">
                                                                <div className="w-18 h-18 bg-white relative">
                                                                    <div className="grid grid-cols-6 gap-0 w-full h-full">
                                                                        {Array.from({ length: 36 }, (_, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className={`${
                                                                                    Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                                                                                }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-base font-medium text-gray-600 mb-2">Student Signature:</p>
                                                                <div className="h-8 border-b border-gray-400 relative">
                                                                    <div className="absolute bottom-0 left-0 text-base font-cursive text-blue-800 opacity-80 truncate">
                                                                        {selectedStudent.full_name.split(' ')[0]} {selectedStudent.full_name.split(' ').slice(-1)[0]}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                <p className="text-base font-medium text-gray-600">Issued by:</p>
                                                                <p className="text-base">University Registrar</p>
                                                                <p className="text-base text-gray-500">Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center border-t border-gray-300 pt-3">
                                                        <p className="text-base text-gray-500 leading-tight">
                                                            Property of UP. If found, return to Registrar.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Card thickness effect */}
                                            <div 
                                                className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 rounded-lg"
                                                style={{ 
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
                    </TabsContent>
                </Tabs>
            </div>

        </AppLayout>
    );
}