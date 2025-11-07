import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Award, Leaf, Droplet, History, Wrench } from "lucide-react";

interface DPPData {
  id: number;
  nftTokenId?: string;
  originalBrand?: string;
  materialComposition?: string;
  manufacturingDate?: string;
  countryOfOrigin?: string;
  ownershipHistory: Array<{
    ownerId: number;
    acquiredAt: string;
    soldAt?: string;
    price?: number;
    currency?: string;
  }>;
  careRepairLog: Array<{
    date: string;
    type: "repair" | "alteration" | "upcycle" | "cleaning";
    description: string;
    performedBy?: string;
    sakEarned?: number;
  }>;
  impactScore: string;
  co2Saved: string;
  waterSaved: string;
  isMinted: boolean;
}

interface DigitalPassportViewerProps {
  dpp: DPPData;
  productName: string;
}

export function DigitalPassportViewer({ dpp, productName }: DigitalPassportViewerProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Digital Product Passport
          </CardTitle>
          {dpp.isMinted && (
            <Badge variant="success">
              NFT Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="provenance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="provenance">Provenance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          {/* Provenance Tab */}
          <TabsContent value="provenance" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Brand</p>
                <p className="text-base font-semibold">{dpp.originalBrand || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Country of Origin</p>
                <p className="text-base font-semibold">{dpp.countryOfOrigin || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Material</p>
                <p className="text-base">{dpp.materialComposition || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Manufacturing Date</p>
                <p className="text-base">{dpp.manufacturingDate || "Unknown"}</p>
              </div>
            </div>

            {dpp.nftTokenId && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-1">NFT Token ID</p>
                <p className="text-xs font-mono break-all">{dpp.nftTokenId}</p>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {/* Ownership History */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <History className="h-4 w-4" />
                Ownership History ({dpp.ownershipHistory.length} transfers)
              </h4>
              <div className="space-y-2">
                {dpp.ownershipHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No ownership history yet</p>
                ) : (
                  dpp.ownershipHistory.map((record, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">Owner #{record.ownerId}</p>
                          <p className="text-xs text-muted-foreground">
                            Acquired: {new Date(record.acquiredAt).toLocaleDateString()}
                          </p>
                          {record.soldAt && (
                            <p className="text-xs text-muted-foreground">
                              Sold: {new Date(record.soldAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {record.price && (
                          <Badge variant="outline">
                            {record.currency} {record.price}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Care & Repair Log */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Wrench className="h-4 w-4" />
                Care & Repair Log ({dpp.careRepairLog.length} entries)
              </h4>
              <div className="space-y-2">
                {dpp.careRepairLog.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No care records yet</p>
                ) : (
                  dpp.careRepairLog.map((record, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="capitalize">
                              {record.type}
                            </Badge>
                            {record.sakEarned && (
                              <Badge variant="success">
                                +{record.sakEarned} SAK
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{record.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(record.date).toLocaleDateString()}
                            {record.performedBy && ` • by ${record.performedBy}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Award className="h-8 w-8 text-primary mb-2" />
                    <p className="text-2xl font-bold">{dpp.impactScore}</p>
                    <p className="text-sm text-muted-foreground">Impact Score</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Leaf className="h-8 w-8 text-green-600 mb-2" />
                    <p className="text-2xl font-bold">{parseFloat(dpp.co2Saved).toFixed(1)} kg</p>
                    <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Droplet className="h-8 w-8 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold">{parseFloat(dpp.waterSaved).toFixed(1)} L</p>
                    <p className="text-sm text-muted-foreground">Water Saved</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Environmental Impact
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                By choosing this pre-loved item, you're contributing to a circular economy and 
                reducing the environmental footprint of fashion. Every purchase, repair, and 
                resale extends the life of this product and saves valuable resources.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
