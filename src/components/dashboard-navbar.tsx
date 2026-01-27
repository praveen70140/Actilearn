'use client';

import { signOut, useSession } from '@/lib/auth-client';
import { DEFAULT_LOGGEDUSER_REDIRECT } from '@/lib/constants';
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/react';
import { IconChevronLeft } from '@tabler/icons-react';
import {
  redirect,
  RedirectType,
  usePathname,
  useRouter,
} from 'next/navigation';

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

  const pathname = usePathname();

  return (
    <Navbar isBordered isBlurred={false}>
      <NavbarBrand className="gap-2">
        {pathname !== DEFAULT_LOGGEDUSER_REDIRECT && (
          <Button
            isIconOnly
            color="secondary"
            variant="light"
            onPress={() =>
              redirect(DEFAULT_LOGGEDUSER_REDIRECT, RedirectType.push)
            }
          >
            <IconChevronLeft />
          </Button>
        )}
        <h1 className="text-primary text-xl font-bold">ActiLearn</h1>
      </NavbarBrand>
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
    </Navbar>
  );
};

export default DashboardNavbar;
