import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyForm } from '@/components/property/PropertyForm';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useAuth } from '@/hooks/useAuth';
import { useMyProperties } from '@/hooks/useProperties';
import { Plus, Building2, DollarSign, Eye, Heart } from 'lucide-react';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { data: properties, isLoading } = useMyProperties(user?.id);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const stats = {
    total: properties?.length || 0,
    active: properties?.filter(p => p.status === 'active').length || 0,
    sold: properties?.filter(p => p.status === 'sold').length || 0,
    totalValue: properties?.reduce((sum, p) => sum + Number(p.price), 0) || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your property listings</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
              </DialogHeader>
              <PropertyForm onSuccess={() => setShowAddDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Properties</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Listings</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sold</p>
                  <p className="text-2xl font-bold">{stats.sold}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                  <p className="text-2xl font-bold">
                    ${(stats.totalValue / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="sold">Sold ({stats.sold})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <PropertyGrid properties={properties} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="active">
            <PropertyGrid
              properties={properties?.filter(p => p.status === 'active')}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="sold">
            <PropertyGrid
              properties={properties?.filter(p => p.status === 'sold')}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
