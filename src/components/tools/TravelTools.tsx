"use client";
import type { Locale } from "@/lib/types";
import PlannerTool from "./PlannerTool";
import ComposerTool from "./ComposerTool";
import IsraelTool from "./IsraelTool";
import ToursTool from "./ToursTool";
import VisaTool from "./VisaTool";
import RibbonTool from "./RibbonTool";
import {
  CruiseTool,
  FlexTool,
  ClubTool,
  GroupTool,
  ContactTool,
} from "./SecondaryTools";
export default function TravelTools({
  locale,
  kind,
}: {
  locale: Locale;
  kind: string;
}) {
  switch (kind) {
    case "planner":
      return <PlannerTool locale={locale} />;
    case "israel":
      return <IsraelTool locale={locale} />;
    case "packages":
    case "flights":
    case "hotels":
      return <ComposerTool locale={locale} kind={kind} />;
    case "tours":
      return <ToursTool locale={locale} />;
    case "visa":
      return <VisaTool locale={locale} />;
    case "ribbon":
      return <RibbonTool locale={locale} />;
    case "cruises":
      return <CruiseTool locale={locale} />;
    case "flex":
      return <FlexTool locale={locale} />;
    case "club":
      return <ClubTool locale={locale} />;
    case "groups":
      return <GroupTool locale={locale} />;
    case "contact":
      return <ContactTool locale={locale} />;
    default:
      return null;
  }
}
