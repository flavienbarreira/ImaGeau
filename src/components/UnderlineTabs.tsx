import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

type TabData = {
  header: string;
  data: any;
};

type UnderlineTabsProps = {
  tabs: TabData[];
};

function UnderlineTabs(props: UnderlineTabsProps) {
  const [activeTab, setActiveTab] = useState(props.tabs[0].header);

  return (
    <Tabs value={activeTab}>
      <TabsHeader
        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
        }}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {props.tabs.map(({ header }) => (
          <Tab
            key={header}
            value={header}
            onClick={() => setActiveTab(header)}
            className={activeTab === header ? "text-gray-900" : ""}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {header}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {props.tabs.map((tab) => (
          <TabPanel key={tab.header} value={tab.header}>
            <Line data={tab.data} />
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}

export default UnderlineTabs;
