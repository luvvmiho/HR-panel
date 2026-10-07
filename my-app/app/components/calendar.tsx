import React from 'react';
import { Calendar, theme } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';

interface Props {
  onDateSelect: (date: string) => void;
}

const CalendarComponent: React.FC<Props> = ({ onDateSelect }) => {
  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    background: token.colorBgContainer,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  };

  const handleSelect: CalendarProps<Dayjs>['onSelect'] = (date) => {
    const formatted = date.format('YYYY-MM-DD');
    onDateSelect(formatted);
  };

  return (
    <div className="w-full flex justify-center">
      <div
        className="w-full sm:w-[320px] p-4 rounded-xl"
        style={wrapperStyle}
      >
        <h3 className="text-center font-semibold text-gray-700 mb-2">Огноо сонгох</h3>
        <Calendar fullscreen={false} onSelect={handleSelect} />
      </div>
    </div>
  );
};

export default CalendarComponent;
