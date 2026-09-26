"use client";

import { useState } from "react";
import { CalendarDays, Plus, MapPin, Bell, Clock, Edit2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EventModal } from "@/components/calendar/EventModal";
import { useCalendar } from "@/lib/calendar/useCalendar";
import { CalendarEvent } from "@/types/calendar";
import {
  formatRomanianDate,
  getDaysOfWeek,
  getRelativeDateLabel,
  getTodayDateString,
  isDateToday,
} from "@/lib/utils/dateUtils";
import { t } from "@/lib/i18n";

export default function CalendarPage() {
  const todayStr = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

  const { events, addEvent, updateEvent, deleteEvent } = useCalendar();

  const weekDays = getDaysOfWeek();

  const handleOpenAdd = () => {
    setEventToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: CalendarEvent) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const selectedDayEvents = events
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const allUpcomingEvents = events
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  const colorTagStyles: Record<string, string> = {
    cyan: "text-nord-8 bg-nord-8/10 border-nord-8/20",
    blue: "text-nord-9 bg-nord-9/10 border-nord-9/20",
    green: "text-nord-14 bg-nord-14/10 border-nord-14/20",
    yellow: "text-nord-13 bg-nord-13/10 border-nord-13/20",
    red: "text-nord-11 bg-nord-11/10 border-nord-11/20",
    purple: "text-nord-15 bg-nord-15/10 border-nord-15/20",
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-nord-6 tracking-tight">
            {t.calendar.title}
          </h1>
          <p className="text-xs text-nord-4/60 font-medium mt-0.5">{t.calendar.subtitle}</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="rounded-full px-3.5 h-8 text-xs font-semibold shadow-[0_0_15px_rgba(136,192,208,0.35)]"
        >
          <Plus className="w-3.5 h-3.5 mr-1 stroke-[2.8]" />
          <span>{t.calendar.newEvent}</span>
        </Button>
      </div>

      {/* Weekdays Strip Selector */}
      <div className="flex gap-1.5 p-1.5 rounded-[22px] bg-[#0E1524]/80 border border-white/[0.08] backdrop-blur-xl shadow-inner overflow-x-auto">
        {weekDays.map((day) => {
          const isSelected = selectedDate === day.dateStr;
          const dayEventsCount = events.filter((e) => e.date === day.dateStr).length;

          return (
            <button
              key={day.dateStr}
              onClick={() => setSelectedDate(day.dateStr)}
              className={`flex-1 min-w-[46px] py-2 px-1 text-xs rounded-2xl transition-all duration-200 flex flex-col items-center gap-1 select-none ${
                isSelected
                  ? "bg-nord-8 text-[#070A0F] font-bold shadow-[0_4px_16px_rgba(136,192,208,0.4)] scale-[1.02]"
                  : "text-nord-4/70 hover:text-nord-6 hover:bg-white/[0.04]"
              }`}
            >
              <span className={`text-[10px] uppercase font-semibold ${isSelected ? "text-[#070A0F]/80" : "text-nord-4/50"}`}>
                {day.dayName}
              </span>
              <span className="text-sm font-bold font-mono leading-none">
                {day.dayNumber}
              </span>
              <div className="flex gap-0.5 mt-0.5 h-1">
                {dayEventsCount > 0 && (
                  <span
                    className={`w-1 h-1 rounded-full ${
                      isSelected ? "bg-[#070A0F]" : "bg-nord-8"
                    }`}
                  />
                )}
                {day.isToday && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-nord-13" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Date Header Indicator Pill */}
      <GlassCard variant="accent" className="p-3.5 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-nord-8/20 text-nord-8 flex items-center justify-center">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-nord-6">
              {formatRomanianDate(selectedDate)}
            </span>
            <p className="text-[11px] text-nord-4/60">
              {selectedDayEvents.length} evenimente în agendă
            </p>
          </div>
        </div>

        {isDateToday(selectedDate) ? (
          <Badge variant="cyan" size="sm" dot>
            {t.calendar.today}
          </Badge>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDate(todayStr)}
            className="text-[11px] text-nord-8 h-7 px-2"
          >
            Sari la azi
          </Button>
        )}
      </GlassCard>

      {/* Events Agenda for Selected Date */}
      <div className="space-y-3">
        {selectedDayEvents.length === 0 ? (
          <GlassCard className="p-8 sm:p-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-nord-8">
              <CalendarDays className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-nord-5">{t.calendar.noEvents}</p>
            <p className="text-xs text-nord-4/60 max-w-xs mx-auto">
              {t.calendar.noEventsSubtext}
            </p>
            <div className="pt-2">
              <Button
                variant="glass"
                size="sm"
                onClick={handleOpenAdd}
                className="text-xs text-nord-8"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Adaugă eveniment
              </Button>
            </div>
          </GlassCard>
        ) : (
          selectedDayEvents.map((event) => {
            const colorClass = colorTagStyles[event.colorTag || "cyan"] || colorTagStyles.cyan;
            return (
              <GlassCard
                key={event.id}
                onClick={() => handleOpenEdit(event)}
                className="p-4 sm:p-5 hover:border-nord-8/30 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-lg border ${colorClass}`}>
                        {event.startTime} – {event.endTime}
                      </span>
                      <Badge variant="outline" size="sm" className="text-[10px]">
                        {getRelativeDateLabel(event.date)}
                      </Badge>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-nord-6 pt-0.5 group-hover:text-nord-8 transition-colors">
                      {event.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {event.hasReminder && (
                      <div className="p-1.5 rounded-xl bg-nord-13/10 text-nord-13 border border-nord-13/20">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(event);
                      }}
                      className="text-nord-4/40 hover:text-nord-8 p-1 rounded-lg hover:bg-white/[0.04] transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {event.description && (
                  <p className="text-xs text-nord-4/70 mt-2 leading-relaxed">
                    {event.description}
                  </p>
                )}

                {event.location && (
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-nord-4/50 font-medium">
                    <MapPin className="w-3 h-3 text-nord-9 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </GlassCard>
            );
          })
        )}
      </div>

      {/* All Upcoming Events Section */}
      {selectedDayEvents.length === 0 && allUpcomingEvents.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-nord-4/60 px-1">
            Următoarele evenimente din agendă
          </p>

          <div className="space-y-2">
            {allUpcomingEvents.slice(0, 3).map((event) => (
              <GlassCard
                key={event.id}
                onClick={() => {
                  setSelectedDate(event.date);
                  handleOpenEdit(event);
                }}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:border-nord-8/30 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-nord-8/15 text-nord-8 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-nord-6 group-hover:text-nord-8 truncate transition-colors">
                      {event.title}
                    </p>
                    <p className="text-[11px] text-nord-4/50 font-mono">
                      {formatRomanianDate(event.date)} la {event.startTime}
                    </p>
                  </div>
                </div>

                <Badge variant="outline" size="sm">
                  {getRelativeDateLabel(event.date)}
                </Badge>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEventToEdit(null);
        }}
        defaultDate={selectedDate}
        eventToEdit={eventToEdit}
        onSave={addEvent}
        onUpdate={updateEvent}
        onDelete={deleteEvent}
      />
    </div>
  );
}
