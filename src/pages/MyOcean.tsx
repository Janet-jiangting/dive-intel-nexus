
import React, { useState } from 'react';
import { Shield, Users, Database, BarChart3, Settings, Crown, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

type UserRole = 'super_admin' | 'admin' | 'super_contributor' | 'contributor';

const MyOcean = () => {
  // Mock user data - in real app this would come from auth context
  const [userRole] = useState<UserRole>('admin'); // Change this to test different roles
  const [userName] = useState('John Diver');

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'super_contributor':
        return <Star className="h-5 w-5 text-purple-500" />;
      case 'contributor':
        return <Award className="h-5 w-5 text-green-500" />;
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'super_contributor':
        return 'Super Contributor';
      case 'contributor':
        return 'Contributor';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'admin':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'super_contributor':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'contributor':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
    }
  };

  const canAccessManageData = userRole === 'super_admin' || userRole === 'admin';

  return (
    <div className="min-h-screen bg-ocean-900">
      <div className="bg-ocean-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-white">My Ocean</h1>
            <Badge className={`flex items-center gap-2 ${getRoleColor(userRole)}`}>
              {getRoleIcon(userRole)}
              {getRoleName(userRole)}
            </Badge>
          </div>
          <p className="text-ocean-200">
            Welcome back, {userName}! Manage your ocean contributions and access exclusive features.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Data Management - Admin/Super Admin Only */}
          {canAccessManageData && (
            <Card className="bg-ocean-800 border-ocean-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ocean-200 mb-4">
                  Import and manage dive site and marine life data for the platform.
                </p>
                <Button asChild className="w-full bg-seagreen-600 hover:bg-seagreen-700">
                  <Link to="/manage-data">
                    Access Manage Data
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* My Contributions */}
          <Card className="bg-ocean-800 border-ocean-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-ocean-200 mb-4">
                View and manage your dive site and marine life contributions.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-ocean-300">Dive Sites:</span>
                  <span className="text-white">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ocean-300">Marine Life:</span>
                  <span className="text-white">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ocean-300">Photos:</span>
                  <span className="text-white">45</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full border-ocean-600 text-white hover:bg-ocean-700">
                <Link to="/community">
                  View Community
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Analytics - Super Admin/Admin/Super Contributor */}
          {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'super_contributor') && (
            <Card className="bg-ocean-800 border-ocean-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ocean-200 mb-4">
                  View platform statistics and contribution analytics.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-300">Total Users:</span>
                    <span className="text-white">1,234</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-300">Active Sites:</span>
                    <span className="text-white">456</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-ocean-600 text-white hover:bg-ocean-700">
                  View Details
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Account Settings */}
          <Card className="bg-ocean-800 border-ocean-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-ocean-200 mb-4">
                Manage your profile, preferences, and account settings.
              </p>
              <Button variant="outline" className="w-full border-ocean-600 text-white hover:bg-ocean-700">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Role Permissions Info */}
        <Card className="bg-ocean-800 border-ocean-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span className="text-white font-medium">Super Admin</span>
                </div>
                <ul className="text-sm text-ocean-300 space-y-1">
                  <li>• Full platform access</li>
                  <li>• Data management</li>
                  <li>• User management</li>
                  <li>• Analytics access</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-white font-medium">Admin</span>
                </div>
                <ul className="text-sm text-ocean-300 space-y-1">
                  <li>• Data management</li>
                  <li>• Content moderation</li>
                  <li>• Analytics access</li>
                  <li>• Community features</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-500" />
                  <span className="text-white font-medium">Super Contributor</span>
                </div>
                <ul className="text-sm text-ocean-300 space-y-1">
                  <li>• Enhanced contributions</li>
                  <li>• Analytics access</li>
                  <li>• Community features</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-500" />
                  <span className="text-white font-medium">Contributor</span>
                </div>
                <ul className="text-sm text-ocean-300 space-y-1">
                  <li>• Data contributions</li>
                  <li>• Community features</li>
                  <li>• Photo uploads</li>
                  <li>• Basic analytics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyOcean;
