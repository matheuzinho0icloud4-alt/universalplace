
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  // if already logged in, redirect to dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      login(formData.email, formData.password).then((success) => {
        if (success) {
          toast({
            title: 'Login successful',
            description: 'Welcome back!',
          });
          navigate('/admin/dashboard');
        } else {
          toast({
            title: 'Login failed',
            description: 'Invalid email or password',
            variant: 'destructive',
          });
          setErrors({ password: 'Invalid credentials' });
        }
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Ofertas Universal Place</title>
        <meta name="description" content="Admin login page for Ofertas Universal Place" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary rounded-full p-3">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold">Admin Login</CardTitle>
            <p className="text-xs md:text-sm text-gray-600">Enter your credentials to access the dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="mt-1 text-sm"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="mt-1 text-sm"
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full text-sm" disabled={authLoading}>
                {authLoading ? 'Signing in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> registrations are disabled. Ask the administrator to create an account if you need access.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/" className="text-sm text-primary hover:underline">
              Back to homepage
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
