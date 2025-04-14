import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPageSimple() {
  const [activeTab, setActiveTab] = useState("login");
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary rounded-lg p-2 mr-2">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="16" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 16.5L16 19.5M14.5 18L17.5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="text-primary font-semibold text-lg">REMOTE <span className="font-bold">HERO</span></div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Welcome to RemoteHero</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <div className="p-4 text-center">
                  <p>This is a simplified login form to test routing.</p>
                  <Button className="mt-4 w-full">Sign In (Test)</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="register">
                <div className="p-4 text-center">
                  <p>This is a simplified registration form to test routing.</p>
                  <Button className="mt-4 w-full">Register (Test)</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Right column - Hero section */}
      <div className="flex-1 bg-primary p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto text-white">
          <h2 className="text-3xl font-bold mb-6">Streamline Your Recruitment Process</h2>
          <p className="mb-6">RemoteHero helps HR agencies manage clients, track prospects, and streamline the entire hiring workflow from sourcing to contract signing.</p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-white bg-opacity-10 p-2 rounded-full mr-3">
                <i className="fas fa-check-circle"></i>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Client-Driven Workflow</h3>
                <p className="text-sm text-blue-100">Manage the entire recruitment process from client requests to hiring.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white bg-opacity-10 p-2 rounded-full mr-3">
                <i className="fas fa-users"></i>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Role-Based Access</h3>
                <p className="text-sm text-blue-100">Different user roles provide appropriate access levels for team members.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white bg-opacity-10 p-2 rounded-full mr-3">
                <i className="fas fa-file-contract"></i>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Contract Management</h3>
                <p className="text-sm text-blue-100">Generate and track contracts and invoices in one place.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}