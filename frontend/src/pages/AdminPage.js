import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car, MessageSquare, LogOut, Plus, Trash2, Eye, Pencil,
  LayoutDashboard, ChevronLeft, X
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.adminLogin(password);
      setToken(res.token);
      localStorage.setItem("admin_token", res.token);
      setLoginError("");
    } catch {
      setLoginError("Неверный пароль");
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("admin_token");
  };

  if (!token) {
    return (
      <div data-testid="admin-login-page" className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-8 h-8 bg-brand-accent flex items-center justify-center">
              <span className="font-heading font-black text-white text-sm">A</span>
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-white">AUTOMINSK</span>
          </div>
          <form onSubmit={handleLogin} className="space-y-4" data-testid="admin-login-form">
            <input
              data-testid="admin-password-input"
              type="password"
              placeholder="Пароль администратора"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark"
            />
            {loginError && <p className="text-sm text-red-400" data-testid="login-error">{loginError}</p>}
            <button data-testid="admin-login-btn" type="submit" className="btn-primary w-full">
              Войти
            </button>
          </form>
          <button
            data-testid="back-to-site-btn"
            onClick={() => navigate("/")}
            className="mt-6 text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 mx-auto transition-colors"
          >
            <ChevronLeft size={14} /> Вернуться на сайт
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-brand-bg">
      {/* Admin Header */}
      <div className="border-b border-white/10 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={20} className="text-brand-accent" />
            <span className="font-heading font-bold text-sm tracking-tight text-white">ПАНЕЛЬ УПРАВЛЕНИЯ</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              data-testid="admin-back-btn"
              onClick={() => navigate("/")}
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft size={14} /> На сайт
            </button>
            <button
              data-testid="admin-logout-btn"
              onClick={handleLogout}
              className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <LogOut size={14} /> Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="cars" className="w-full">
          <TabsList className="bg-brand-surface border border-white/10 mb-8" data-testid="admin-tabs">
            <TabsTrigger value="cars" data-testid="tab-cars" className="data-[state=active]:bg-brand-accent data-[state=active]:text-white gap-2 text-xs uppercase tracking-wider">
              <Car size={14} /> Автомобили
            </TabsTrigger>
            <TabsTrigger value="submissions" data-testid="tab-submissions" className="data-[state=active]:bg-brand-accent data-[state=active]:text-white gap-2 text-xs uppercase tracking-wider">
              <MessageSquare size={14} /> Заявки
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cars">
            <CarsManager token={token} />
          </TabsContent>
          <TabsContent value="submissions">
            <SubmissionsManager token={token} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CarsManager({ token }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCar, setEditCar] = useState(null);

  const loadCars = useCallback(async () => {
    try {
      const data = await api.getCars();
      setCars(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCars(); }, [loadCars]);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить автомобиль?")) return;
    await api.deleteCar(id, token);
    loadCars();
  };

  const openCreate = () => { setEditCar(null); setDialogOpen(true); };
  const openEdit = (car) => { setEditCar(car); setDialogOpen(true); };

  return (
    <div data-testid="cars-manager">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold">Автомобили ({cars.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button data-testid="add-car-btn" onClick={openCreate} className="btn-primary flex items-center gap-2 py-2 px-4 text-xs">
              <Plus size={14} /> Добавить
            </button>
          </DialogTrigger>
          <DialogContent className="bg-brand-surface border-white/10 max-w-lg max-h-[90vh] overflow-y-auto" data-testid="car-dialog">
            <DialogHeader>
              <DialogTitle className="font-heading">{editCar ? "Редактировать" : "Добавить автомобиль"}</DialogTitle>
            </DialogHeader>
            <CarForm
              token={token}
              car={editCar}
              onDone={() => { setDialogOpen(false); loadCars(); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-white/10 rounded-sm overflow-hidden">
        <Table data-testid="cars-table">
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider text-zinc-500">Марка / Модель</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-zinc-500">Год</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-zinc-500">Цена</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-zinc-500">Европа</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-zinc-500 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-zinc-500 py-8">Загрузка...</TableCell></TableRow>
            ) : cars.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-zinc-500 py-8">Нет автомобилей</TableCell></TableRow>
            ) : cars.map((car) => (
              <TableRow key={car.id} className="border-white/10" data-testid={`car-row-${car.id}`}>
                <TableCell className="font-medium">{car.brand} {car.model}</TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>${new Intl.NumberFormat("ru-RU").format(car.price)}</TableCell>
                <TableCell>
                  {car.is_from_europe ? (
                    <span className="text-brand-accent text-xs font-semibold uppercase">Да</span>
                  ) : (
                    <span className="text-zinc-600 text-xs">Нет</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      data-testid={`edit-car-${car.id}`}
                      onClick={() => openEdit(car)}
                      className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      data-testid={`delete-car-${car.id}`}
                      onClick={() => handleDelete(car.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CarForm({ token, car, onDone }) {
  const [form, setForm] = useState(
    car
      ? { ...car }
      : { brand: "", model: "", year: 2024, price: 0, mileage: 0, engine: "", transmission: "Автомат", image_url: "", description: "", is_from_europe: false }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (car) {
        await api.updateCar(car.id, form, token);
      } else {
        await api.createCar(form, token);
      }
      onDone();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const update = (key, val) => setForm({ ...form, [key]: val });

  return (
    <form onSubmit={handleSave} className="space-y-4" data-testid="car-form">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500 mb-1 block">Марка *</label>
          <input data-testid="car-brand" value={form.brand} onChange={(e) => update("brand", e.target.value)} className="input-dark text-sm" required />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500 mb-1 block">Модель *</label>
          <input data-testid="car-model" value={form.model} onChange={(e) => update("model", e.target.value)} className="input-dark text-sm" required />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500 mb-1 block">Год *</label>
          <input data-testid="car-year" type="number" value={form.year} onChange={(e) => update("year", parseInt(e.target.value) || 0)} className="input-dark text-sm" required />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500 mb-1 block">Цена ($) *</label>
          <input data-testid="car-price" type="number" value={form.price} onChange={(e) => update("price", parseInt(e.target.value) || 0)} className="input-dark text-sm" required />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500 mb-1 block">Пробег (км)</label>
          <input data-testid="car-mileage" type="number" value={form.mileage} onChange={(e) => update("mileage", parseInt(e.target.value) || 0)} className="input-dark text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500 mb-1 block">Двигатель</label>
          <input data-testid="car-engine" value={form.engine} onChange={(e) => update("engine", e.target.value)} className="input-dark text-sm" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500 mb-1 block">Коробка</label>
          <Select value={form.transmission} onValueChange={(v) => update("transmission", v)}>
            <SelectTrigger className="bg-transparent border-white/20 text-white h-11" data-testid="car-transmission">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-brand-surface border-white/10">
              <SelectItem value="Автомат">Автомат</SelectItem>
              <SelectItem value="Механика">Механика</SelectItem>
              <SelectItem value="PDK">PDK</SelectItem>
              <SelectItem value="Tiptronic">Tiptronic</SelectItem>
              <SelectItem value="DSG">DSG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-zinc-500 mb-1 block">URL изображения</label>
        <input data-testid="car-image-url" value={form.image_url} onChange={(e) => update("image_url", e.target.value)} className="input-dark text-sm" placeholder="https://..." />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-zinc-500 mb-1 block">Описание</label>
        <textarea data-testid="car-description" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} className="input-dark text-sm resize-none" />
      </div>
      <label className="flex items-center gap-3 cursor-pointer" data-testid="car-europe-toggle">
        <input
          type="checkbox"
          checked={form.is_from_europe}
          onChange={(e) => update("is_from_europe", e.target.checked)}
          className="w-4 h-4 accent-brand-accent"
        />
        <span className="text-sm text-zinc-300">Автомобиль из Европы</span>
      </label>
      <button data-testid="car-save-btn" type="submit" disabled={saving} className="btn-primary w-full py-3 disabled:opacity-50">
        {saving ? "Сохранение..." : (car ? "Сохранить изменения" : "Добавить автомобиль")}
      </button>
    </form>
  );
}

function SubmissionsManager({ token }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSubs = useCallback(async () => {
    try {
      const data = await api.getSubmissions(token);
      setSubs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadSubs(); }, [loadSubs]);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить заявку?")) return;
    await api.deleteSubmission(id, token);
    loadSubs();
  };

  const handleRead = async (id) => {
    await api.markRead(id, token);
    loadSubs();
  };

  const serviceLabels = { general: "Общий", buy: "Покупка", europe: "Из Европы" };

  const unreadCount = subs.filter(s => !s.is_read).length;

  return (
    <div data-testid="submissions-manager">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold">
          Заявки ({subs.length})
          {unreadCount > 0 && (
            <span className="ml-2 text-xs bg-brand-accent text-white px-2 py-0.5 font-semibold">
              {unreadCount} новых
            </span>
          )}
        </h2>
      </div>

      <div className="border border-white/10 rounded-sm overflow-hidden">
        <Table data-testid="submissions-table">
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider text-zinc-500">Имя</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-zinc-500">Телефон</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-zinc-500">Тип</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-zinc-500">Сообщение</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-zinc-500">Дата</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-zinc-500 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-zinc-500 py-8">Загрузка...</TableCell></TableRow>
            ) : subs.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-zinc-500 py-8">Нет заявок</TableCell></TableRow>
            ) : subs.map((sub) => (
              <TableRow
                key={sub.id}
                className={`border-white/10 ${!sub.is_read ? "bg-brand-accent/5" : ""}`}
                data-testid={`sub-row-${sub.id}`}
              >
                <TableCell className="font-medium">
                  {!sub.is_read && <span className="inline-block w-2 h-2 bg-brand-accent rounded-full mr-2" />}
                  {sub.name}
                </TableCell>
                <TableCell>{sub.phone}</TableCell>
                <TableCell>
                  <span className="text-xs uppercase tracking-wider text-zinc-400">
                    {serviceLabels[sub.service_type] || sub.service_type}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-zinc-400 text-sm">{sub.message || "—"}</TableCell>
                <TableCell className="text-sm text-zinc-500">
                  {new Date(sub.created_at).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    {!sub.is_read && (
                      <button
                        data-testid={`read-sub-${sub.id}`}
                        onClick={() => handleRead(sub.id)}
                        className="p-1.5 text-zinc-500 hover:text-green-400 transition-colors"
                        title="Отметить прочитанным"
                      >
                        <Eye size={14} />
                      </button>
                    )}
                    <button
                      data-testid={`delete-sub-${sub.id}`}
                      onClick={() => handleDelete(sub.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
