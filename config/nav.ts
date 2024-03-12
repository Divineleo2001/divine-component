import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, HomeIcon } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/account", title: "Account", icon: Cog },
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Entities",
    links: [
      {
        href: "/patient-disabilities",
        title: "Patient Disabilities",
        icon: Globe,
      },
      {
        href: "/patient-comorbidities",
        title: "Patient Comorbidities",
        icon: Globe,
      },
      {
        href: "/histories",
        title: "Histories",
        icon: Globe,
      },
      {
        href: "/comments",
        title: "Comments",
        icon: Globe,
      },
      {
        href: "/vitals",
        title: "Vitals",
        icon: Globe,
      },
      {
        href: "/patients",
        title: "Patients",
        icon: Globe,
      },
    ],
  },

];

