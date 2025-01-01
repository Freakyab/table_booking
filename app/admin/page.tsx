"use client";
import React, { useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import BookingCard from "@/components/boookings";

function Page() {
  const [isLogin, setIsLogin] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [bookings, setBookings] = useState([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "test@gmail.com",
    password: "test@22",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://freakyab-table-booking-backend.vercel.app/booking/admin"
        );
        const data = await res.json();
        if (res.status !== 200) {
          toast({
            title: "Error",
            description: "Failed to fetch filled",
            variant: "destructive",
          });
          return;
        }

        if (data.data && data.status === "success") {
          setBookings(data.data);
        }
      } catch (e) {
        console.error(e);
        toast({
          title: "Error",
          description: "Failed to fetch filled",
          variant: "destructive",
        });
      }
    };
    if (!isLogin) {
      fetchData();
    }
  }, [isLogin, refresh]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { email, password } = formData;
    if (!email || !password) return;
    if (email !== "test@gmail.com" || password !== "test@22") {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
      return;
    }
    setIsLogin(false);
    setFormData({ email: "", password: "" });
  };

  return (
    <div className="flex flex-col p-4 w-full h-full">
      {isLogin ? (
        <>
          <div className="border-[#E76F51] bg-[rgb(231,111,81,0.7)] p-3 m-3 text-white rounded-md">
            <h1>
              Use username :
              <span className="px-2 italic text-black font-bold">
                test@gmail.com
              </span>
              and password :
              <span className="px-2 italic text-black font-bold">test@22</span>
              for testing
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 space-y-3">
            <div className="w-full flex-1 rounded-xl border bg-white px-6 pb-4 pt-8 shadow-md md:w-96">
              <h1 className="mb-3 text-2xl font-bold">
                Please log in to continue.
              </h1>
              <div className="w-full">
                <div>
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                    htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-lg border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                    htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-lg border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-lg bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800">
                <span className="text-sm">Log in</span>
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="p-4 w-full h-full md:p-8">
          {bookings.length === 0 ? (
            <div className="col-span-3 text-center text-lg font-semibold">
              No bookings found
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-center col-span-3 mb-4">
              Restaurant Table Booking
            </h1>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 row-auto gap-4 items-center">
            {bookings.map((booking, index) => (
              <BookingCard
                setRefresh={setRefresh}
                key={index}
                booking={booking}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
