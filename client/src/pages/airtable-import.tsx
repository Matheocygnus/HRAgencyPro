import React, { useState } from "react";
import Dashboard from "@/components/layout/Dashboard";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, AlertCircle, Check, Database, UploadCloud } from "lucide-react";

// Define schema for the import form
const importSchema = z.object({
  data: z.string().min(10, "Data must be at least 10 characters long")
});

export default function AirtableImportPage() {
  const { toast } = useToast();
  const [importResults, setImportResults] = useState<any>(null);
  
  // Get Airtable connection status
  const checkAirtable = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", "/api/airtable/check");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Airtable Connection",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Connection Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Import data mutation
  const importData = useMutation({
    mutationFn: async (data: string) => {
      const res = await apiRequest("POST", "/api/airtable/import", { data });
      return res.json();
    },
    onSuccess: (data) => {
      setImportResults(data);
      toast({
        title: "Import Successful",
        description: `${data.totalProcessed} records processed`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Import Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Sync heroes with database
  const syncHeroes = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/airtable/sync/heroes");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Heroes Sync Complete",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sync Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Sync prospects with database
  const syncProspects = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/airtable/sync/prospects");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Prospects Sync Complete",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sync Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form for data import
  const form = useForm<z.infer<typeof importSchema>>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      data: "",
    },
  });

  // Submit handler for import form
  const onSubmit = (values: z.infer<typeof importSchema>) => {
    importData.mutate(values.data);
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Airtable Data Import</h1>
        <Button
          onClick={() => checkAirtable.mutate()}
          disabled={checkAirtable.isPending}
        >
          {checkAirtable.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Check Airtable Connection
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="sync">Sync with Database</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Data to Airtable</CardTitle>
              <CardDescription>
                Paste your tab-separated data from the spreadsheet to import heroes and prospects.
                Only entries with defined roles will be imported.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pasted Data</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your tab-separated data here..."
                            className="min-h-[300px] font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The data should be tab-separated values copied directly from a spreadsheet.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={importData.isPending}
                  >
                    {importData.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Import to Airtable
                      </>
                    )}
                  </Button>
                </form>
              </Form>
              
              {importResults && (
                <div className="mt-6">
                  <Separator className="my-4" />
                  <h3 className="text-lg font-medium mb-4">Import Results</h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Heroes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-primary">{importResults.results.heroes}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Prospects</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-primary">{importResults.results.prospects}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Skipped</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-muted-foreground">{importResults.results.skipped}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertTitle>Import Complete</AlertTitle>
                    <AlertDescription>
                      {importResults.totalProcessed} records were processed. 
                      Click on the "Sync with Database" tab to sync the imported data with your RemoteHero database.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle>Sync Airtable Data with RemoteHero</CardTitle>
              <CardDescription>
                Sync your imported Airtable data with the RemoteHero database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Heroes</CardTitle>
                    <CardDescription>
                      Sync heroes from Airtable to your RemoteHero database.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => syncHeroes.mutate()}
                      disabled={syncHeroes.isPending}
                    >
                      {syncHeroes.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Syncing Heroes...
                        </>
                      ) : (
                        "Sync Heroes"
                      )}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Prospects</CardTitle>
                    <CardDescription>
                      Sync prospects from Airtable to your RemoteHero database.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => syncProspects.mutate()}
                      disabled={syncProspects.isPending}
                    >
                      {syncProspects.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Syncing Prospects...
                        </>
                      ) : (
                        "Sync Prospects"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <Alert className="mt-6" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Syncing will attempt to create new records in your database. Make sure your data is
                  properly formatted in Airtable before syncing to avoid duplicates or errors.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Dashboard>
  );
}