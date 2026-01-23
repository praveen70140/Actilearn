'use client';

import { signOut, useSession } from '@/lib/auth-client';
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/react';
import { useRouter } from 'next/navigation';

const DashboardNavbar = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    // TODO:Properly handle sign-out server side
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  return (
    <Navbar isBordered isBlurred={false}>
      <NavbarBrand>
        <h1 className="text-primary text-xl font-bold">ActiLearn</h1>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <p>Welcome, {session?.user.name}</p>
          </NavbarItem>
          <NavbarItem>
            <Button onPress={handleSignOut} variant="bordered">
              Sign Out
            </Button>
          </NavbarItem>
        </NavbarContent>
      </NavbarBrand>
    </Navbar>
  );
};

export default DashboardNavbar;
