"use client";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Cell,
  Legend,
} from "recharts";
import { useState } from "react";
import { formatCurrency } from "@/utils/format";
import { useTransactions } from "@/hooks/useTransaction";
import { categoryColors } from "@/constant/categoryColors";
import { categoryOptions } from "@/db/schema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: any) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 0));
  const cos = Math.cos(-RADIAN * (midAngle ?? 0));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className="capitalize"
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${formatCurrency(value)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${((percent ?? 0) * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function TransactionPieChart() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { data } = useTransactions();

  const currentMonthData = data.filter((item) => {
    const txDate = new Date(item.transactionDate);
    const currDate = new Date();
    return (
      txDate.getMonth() == currDate.getMonth() &&
      txDate.getFullYear() == currDate.getFullYear()
    );
  });
  const totalsByCategory = Object.entries(
    currentMonthData.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          <div className="flex items-center justify-between">
            Monthly Expense Breakdown
          </div>
        </CardTitle>
      </CardHeader>
      {totalsByCategory.length === 0 ? (
        <div className="text-muted-foreground flex h-48 items-center justify-center">
          No transactions found for this month.
        </div>
      ) : (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              activeShape={renderActiveShape}
              activeIndex={activeIndex ?? undefined}
              data={totalsByCategory}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {totalsByCategory.map((item, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    categoryColors[
                      item.name as (typeof categoryOptions)[number]
                    ].color
                  }
                />
              ))}
            </Pie>
            <Legend
              content={({ payload }) => (
                <ul className="flex flex-wrap justify-center gap-3">
                  {payload?.map((entry, index) => (
                    <li
                      key={`item-${index}`}
                      className="flex items-center gap-1 capitalize"
                    >
                      <span
                        className="block h-3 w-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      {entry.value}
                    </li>
                  ))}
                </ul>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
