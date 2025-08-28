import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { MoreHorizontal, Search, Users, UserCheck, UserX } from 'lucide-react';
import { useToast } from '../components/ui/toast';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export default function UsersPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingRoles, setUpdatingRoles] = useState<Set<string>>(new Set());

  const handleRoleChange = async (
    userId: string,
    newRole: 'user' | 'admin'
  ) => {
    try {
      setUpdatingRoles((prev) => new Set(prev).add(userId));

      const updatedUser = await authApi.updateUserRole(userId, newRole);

      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: updatedUser.role } : user
        )
      );

      // Show success toast
      const userDisplay = users.find((u) => u.id === userId);
      const userName = userDisplay
        ? `${userDisplay.firstName} ${userDisplay.lastName}`
        : 'User';
      showToast(`${userName}'s role has been updated to ${newRole}`, 'success');
    } catch (error) {
      console.error('Failed to update user role:', error);

      // Show error toast
      const userDisplay = users.find((u) => u.id === userId);
      const userName = userDisplay
        ? `${userDisplay.firstName} ${userDisplay.lastName}`
        : 'User';
      showToast(
        `Failed to update ${userName}'s role. Please try again.`,
        'error'
      );
    } finally {
      setUpdatingRoles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchUsers = async () => {
        try {
          const users = await authApi.getUsers();
          setUsers(users || []);
        } catch (error) {
          console.error('Failed to fetch users:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [user?.role]);

  // Check if current user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleDateString();
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">
          Manage and view all registered users in the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Users ({filteredUsers.length})
              </CardTitle>
              <CardDescription>
                View and manage user accounts and permissions.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {searchTerm
                        ? 'No users found matching your search.'
                        : 'No users found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((userData) => (
                    <TableRow key={userData.id}>
                      <TableCell>
                        <div className="font-medium">
                          {userData.firstName} {userData.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {userData.id}
                        </div>
                      </TableCell>
                      <TableCell>{userData.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            userData.role === 'admin' ? 'default' : 'secondary'
                          }
                        >
                          {userData.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {userData.isActive ? (
                            <UserCheck className="h-4 w-4 text-green-500" />
                          ) : (
                            <UserX className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {userData.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatDate(userData.lastLoginAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatDateTime(userData.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit user</DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Role Assignment Section */}
                            {userData.role === 'user' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(userData.id, 'admin')
                                }
                                disabled={updatingRoles.has(userData.id)}
                                className="text-blue-600"
                              >
                                {updatingRoles.has(userData.id)
                                  ? 'Updating...'
                                  : 'Make Admin'}
                              </DropdownMenuItem>
                            )}

                            {userData.role === 'admin' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(userData.id, 'user')
                                }
                                disabled={updatingRoles.has(userData.id)}
                                className="text-orange-600"
                              >
                                {updatingRoles.has(userData.id)
                                  ? 'Updating...'
                                  : 'Remove Admin'}
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className={
                                userData.isActive
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }
                            >
                              {userData.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
