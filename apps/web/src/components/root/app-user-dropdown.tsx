"use client";

import type { User } from "@datango/auth";
import {
  Check,
  Cog,
  LanguagesIcon,
  LockKeyholeOpen,
  LogOutIcon,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { FlagIndonesiaIcon } from "@/components/icons/flag-indonesia";
import { FlagUSAIcon } from "@/components/icons/flag-usa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/features/auth/components/logout-button";

export function AppUserDropdown({ user }: { user: User }) {
  const { theme, setTheme } = useTheme();
  const userImage = user.image;
  const userName = user.name;
  const userEmail = user.email;
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex max-w-44 shrink-0 cursor-pointer items-center p-0.5 pl-3 lg:max-w-52">
          <div className="mr-2 hidden flex-1 text-left text-sm leading-tight sm:grid">
            <span className="truncate text-right text-sm leading-none">{userName}</span>
            <span className="truncate text-right text-muted-foreground text-xs">{userEmail}</span>
          </div>
          <Avatar className="size-8 overflow-hidden rounded-lg">
            {userImage && <AvatarImage alt={userName} className="object-contain" src={userImage} />}
            <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col text-muted-foreground text-xs sm:hidden">
          <p className="text-sm">{userName}</p>
          <p className="text-muted-foreground text-xs">{userEmail}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="sm:hidden" />
        <DropdownMenuLabel className="pb-0 text-muted-foreground text-xs">
          Akun Saya
        </DropdownMenuLabel>
        <DropdownMenuItem>
          <Cog className="mr-2 size-4" />
          Pengaturan Akun
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LockKeyholeOpen className="mr-2 size-4" />
          Ubah Password
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="pb-0 text-muted-foreground text-xs">
          Preferensi
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Monitor className="mr-2 size-4" />
              Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 size-4" />
                Light
                {theme === "light" && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 size-4" />
                Dark
                {theme === "dark" && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 size-4" />
                System
                {theme === "system" && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="sm:hidden">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <LanguagesIcon className="mr-2 size-4" />
              Bahasa
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <FlagIndonesiaIcon className="mr-2 size-4" />
                Indonesia
                <Check className="ml-auto size-4" />
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <FlagUSAIcon className="mr-2 size-4" />
                English<p className="text-muted-foreground text-xs">(soon)</p>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <LogoutButton>
          <DropdownMenuItem>
            <LogOutIcon className="mr-2 size-4" />
            Log out
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
