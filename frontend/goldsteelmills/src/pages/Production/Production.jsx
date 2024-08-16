import { PageHeader } from "../../components/PageHeader.jsx";
import { ProductionTabs } from "../../components/Production/ProductionTabs.jsx";


export const Production = () => {
  return (
    <div className="flex flex-col gap-3">
      <PageHeader title="Products & Productions" />
      <ProductionTabs />
    </div>
  );
};
