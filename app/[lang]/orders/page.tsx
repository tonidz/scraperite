"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
} from "lucide-react";
import { formatCurrency } from "@/lib/stripe/config";
import type { User } from "@supabase/supabase-js";

interface OrderItem {
  name: string;
  quantity: number;
  unitAmount: number;
  total: number;
}

interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface Order {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  customer_name: string;
  shipping_address: Address | null;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  currency: string;
  status: string;
  payment_status: string;
  created_at: string;
}

// Dictionary type for this page
interface OrdersDict {
  title: string;
  empty: string;
  orderNumber: string;
  date: string;
  status: string;
  total: string;
  viewDetails: string;
  items: string;
  shippingAddress: string;
  paymentStatus: string;
  loginRequired: string;
  signIn: string;
  statuses: Record<string, string>;
  paymentStatuses: Record<string, string>;
}

export default function OrdersPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [dict, setDict] = useState<OrdersDict | null>(null);

  useEffect(() => {
    // Load dictionary
    const loadDict = async () => {
      try {
        const dictionary = await import(`@/i18n/dictionaries/${lang}.json`);
        setDict(dictionary.orders);
      } catch {
        const fallback = await import("@/i18n/dictionaries/en.json");
        setDict(fallback.orders);
      }
    };
    loadDict();
  }, [lang]);

  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch orders for this user
        const { data: ordersData, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
        } else {
          setOrders(ordersData || []);
        }
      }

      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        checkUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      lang === "sv" ? "sv-SE" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusColor = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipped":
      case "processing":
        return "secondary";
      case "cancelled":
      case "refunded":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPaymentStatusColor = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
      case "refunded":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading || !dict) {
    return (
      <div className="min-h-screen bg-[#FFE566] pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFE566] pt-24 pb-12 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-6">{dict.loginRequired}</p>
            <Button
              onClick={() => router.push(`/${lang}/login`)}
              className="bg-black text-white hover:bg-gray-800"
            >
              {dict.signIn}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFE566] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8">{dict.title}</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-600">{dict.empty}</p>
              <Button
                onClick={() => router.push(`/${lang}/products`)}
                className="mt-6 bg-black text-white hover:bg-gray-800"
              >
                {lang === "sv" ? "Utforska produkter" : "Explore Products"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id
                    )
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">
                          {dict.orderNumber} #
                          {order.stripe_session_id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <Badge variant={getStatusColor(order.status)}>
                          {dict.statuses[order.status] || order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {formatCurrency(order.total / 100)}
                        </p>
                        <Badge
                          variant={getPaymentStatusColor(order.payment_status)}
                          className="mt-1"
                        >
                          {dict.paymentStatuses[order.payment_status] ||
                            order.payment_status}
                        </Badge>
                      </div>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {expandedOrder === order.id && (
                  <CardContent className="border-t bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          {dict.items}
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-white p-3 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                  {item.quantity}x{" "}
                                  {formatCurrency(item.unitAmount / 100)}
                                </p>
                              </div>
                              <p className="font-medium">
                                {formatCurrency(item.total / 100)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-4 pt-4 border-t space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>{formatCurrency(order.subtotal / 100)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              {lang === "sv" ? "Frakt" : "Shipping"}
                            </span>
                            <span>
                              {formatCurrency(order.shipping_cost / 100)}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold pt-2 border-t">
                            <span>{dict.total}</span>
                            <span>{formatCurrency(order.total / 100)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping & Payment */}
                      <div className="space-y-6">
                        {/* Shipping Address */}
                        {order.shipping_address && (
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {dict.shippingAddress}
                            </h4>
                            <div className="bg-white p-3 rounded-lg text-sm">
                              <p>{order.customer_name}</p>
                              <p>{order.shipping_address.line1}</p>
                              {order.shipping_address.line2 && (
                                <p>{order.shipping_address.line2}</p>
                              )}
                              <p>
                                {order.shipping_address.postal_code}{" "}
                                {order.shipping_address.city}
                              </p>
                              <p>{order.shipping_address.country}</p>
                            </div>
                          </div>
                        )}

                        {/* Payment Info */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            {dict.paymentStatus}
                          </h4>
                          <div className="bg-white p-3 rounded-lg">
                            <Badge
                              variant={getPaymentStatusColor(
                                order.payment_status
                              )}
                            >
                              {dict.paymentStatuses[order.payment_status] ||
                                order.payment_status}
                            </Badge>
                            <p className="text-sm text-gray-500 mt-2">
                              {order.customer_email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
