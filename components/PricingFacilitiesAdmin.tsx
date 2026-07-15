import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Edit2,
  Plus,
  X,
  Trash2,
  Wifi,
  Flame,
  Clock,
  Car,
  Snowflake,
  Mountain,
  UtensilsCrossed,
  MapPin,
  Tv,
  Waves,
  Star,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface VillaPricing {
  id_villa_pricing: string;
  villa_name: string;
  weekend_price: number;
  weekday_price: number;
  description: string | null;
  currency: string;
  updated_at: string;
}

interface VillaFacility {
  id_villa_facilities: string;
  name: string;
  description?: string | null;
  icon_name?: string | null;
  category?: string | null;
  is_active?: boolean;
  display_order?: number | null;
}

const PricingFacilitiesAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<VillaPricing | null>(null);
  const [pricingForm, setPricingForm] = useState<Partial<VillaPricing>>({});
  const [editingPricing, setEditingPricing] = useState(false);

  const [facilities, setFacilities] = useState<VillaFacility[]>([]);
  const [newFacility, setNewFacility] = useState({
    name: "",
    description: "",
    category: "general",
    icon_name: "",
  });
  const [editingFacilities, setEditingFacilities] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(
    null,
  );
  const [editingFacilityForm, setEditingFacilityForm] = useState({
    name: "",
    description: "",
    category: "general",
    icon_name: "",
  });

  const iconOptions = [
    "Wifi",
    "Flame",
    "Clock",
    "Car",
    "Snowflake",
    "Mountain",
    "UtensilsCrossed",
    "MapPin",
    "Tv",
    "Waves",
    "Star",
    "Check",
  ];

  const iconComponentMap: Record<string, any> = {
    Wifi,
    Flame,
    Clock,
    Car,
    Snowflake,
    Mountain,
    UtensilsCrossed,
    MapPin,
    Tv,
    Waves,
    Star,
    Check,
  };

  const uploadIconToStorage = async (file: File) => {
    try {
      const filePath = `facility-icons/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("facility-icons")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        toast.error(`Gagal mengunggah ikon: ${uploadError.message}`);
        return null;
      }

      const { data } = await supabase.storage
        .from("facility-icons")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        toast.error("Unggah berhasil tetapi gagal membuat URL publik.");
        return null;
      }

      return data.publicUrl;
    } catch (err: any) {
      console.error("Upload icon error:", err);
      toast.error(`Gagal mengunggah ikon: ${err?.message || err}`);
      return null;
    }
  };

  const handleNewIconFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar yang boleh diunggah.");
      return;
    }
    const url = await uploadIconToStorage(file);
    if (url) setNewFacility({ ...newFacility, icon_name: url });
  };

  const handleEditIconFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar yang boleh diunggah.");
      return;
    }
    const url = await uploadIconToStorage(file);
    if (url) setEditingFacilityForm({ ...editingFacilityForm, icon_name: url });
  };

  useEffect(() => {
    fetchPricingAndFacilities();
  }, []);

  const fetchPricingAndFacilities = async () => {
    try {
      setLoading(true);

      // Fetch pricing
      const { data: pricingData, error: pricingError } = await supabase
        .from("villa_pricing")
        .select("*")
        .eq("villa_name", "D'VILLAMODA")
        .single();

      if (pricingData) {
        setPricing(pricingData);
      }

      // Fetch facilities
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from("villa_facilities")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (facilitiesData) {
        setFacilities(facilitiesData);
      }
    } catch (err) {
      console.error("Error fetching pricing and facilities:", err);
      toast.error("Gagal memuat data harga dan fasilitas");
    } finally {
      setLoading(false);
    }
  };

  const savePricing = async () => {
    if (!pricing || !pricingForm.weekend_price || !pricingForm.weekday_price) {
      toast.error("Harga weekend dan weekday harus diisi");
      return;
    }

    try {
      const { error } = await supabase
        .from("villa_pricing")
        .update({
          weekend_price: pricingForm.weekend_price,
          weekday_price: pricingForm.weekday_price,
          description: pricingForm.description,
        })
        .eq("id_villa_pricing", pricing.id_villa_pricing);

      if (error) throw error;

      setPricing({ ...pricing, ...pricingForm });
      setEditingPricing(false);
      setPricingForm({});
      toast.success("Harga berhasil diperbarui!");
    } catch (err) {
      console.error("Error saving pricing:", err);
      toast.error("Gagal menyimpan harga");
    }
  };

  const addFacility = async () => {
    if (!newFacility.name.trim()) {
      toast.error("Nama fasilitas wajib diisi");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("villa_facilities")
        .insert([
          {
            name: newFacility.name,
            description: newFacility.description || null,
            icon_name: newFacility.icon_name || null,
            category: newFacility.category,
            is_active: true,
            display_order: facilities.length + 1,
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        setFacilities([...facilities, data[0]]);
        setNewFacility({
          name: "",
          description: "",
          category: "general",
          icon_name: "",
        });
        toast.success("Fasilitas berhasil ditambahkan!");
      }
    } catch (err) {
      console.error("Error adding facility:", err);
      toast.error("Gagal menambah fasilitas");
    }
  };

  const deleteFacility = async (id: string) => {
    if (!window.confirm("Hapus fasilitas ini?")) return;

    try {
      const { error } = await supabase
        .from("villa_facilities")
        .delete()
        .eq("id_villa_facilities", id);

      if (error) throw error;

      setFacilities(facilities.filter((f) => f.id_villa_facilities !== id));
      toast.success("Fasilitas berhasil dihapus!");
    } catch (err) {
      console.error("Error deleting facility:", err);
      toast.error("Gagal menghapus fasilitas");
    }
  };

  const startEditFacility = (facility: VillaFacility) => {
    setEditingFacilityId(facility.id_villa_facilities);
    setEditingFacilityForm({
      name: facility.name,
      description: facility.description || "",
      category: facility.category,
      icon_name: facility.icon_name || "",
    });
    setEditingFacilities(false);
  };

  const updateFacility = async () => {
    if (!editingFacilityId || !editingFacilityForm.name.trim()) {
      toast.error("Nama fasilitas wajib diisi");
      return;
    }

    try {
      const { error } = await supabase
        .from("villa_facilities")
        .update({
          name: editingFacilityForm.name,
          description: editingFacilityForm.description || null,
          icon_name: editingFacilityForm.icon_name || null,
          category: editingFacilityForm.category,
        })
        .eq("id_villa_facilities", editingFacilityId);

      if (error) throw error;

      setFacilities(
        facilities.map((facility) =>
          facility.id_villa_facilities === editingFacilityId
            ? {
                ...facility,
                name: editingFacilityForm.name,
                description: editingFacilityForm.description || null,
                icon_name: editingFacilityForm.icon_name || null,
                category: editingFacilityForm.category,
              }
            : facility,
        ),
      );

      setEditingFacilityId(null);
      setEditingFacilityForm({
        name: "",
        description: "",
        category: "general",
        icon_name: "",
      });
      toast.success("Fasilitas berhasil diperbarui!");
    } catch (err) {
      console.error("Error updating facility:", err);
      toast.error("Gagal memperbarui fasilitas");
    }
  };

  return (
    <div className="space-y-8">
      {/* Pricing Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Harga Villa</h2>
          {!editingPricing && (
            <Button
              onClick={() => {
                setPricingForm(pricing || {});
                setEditingPricing(true);
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Harga
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : editingPricing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Harga Weekend (Rp)
              </label>
              <Input
                type="number"
                value={pricingForm.weekend_price || ""}
                onChange={(e) =>
                  setPricingForm({
                    ...pricingForm,
                    weekend_price: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Harga Weekday (Rp)
              </label>
              <Input
                type="number"
                value={pricingForm.weekday_price || ""}
                onChange={(e) =>
                  setPricingForm({
                    ...pricingForm,
                    weekday_price: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Deskripsi
              </label>
              <textarea
                value={pricingForm.description || ""}
                onChange={(e) =>
                  setPricingForm({
                    ...pricingForm,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={savePricing}>Simpan</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingPricing(false);
                  setPricingForm({});
                }}
              >
                Batal
              </Button>
            </div>
          </div>
        ) : pricing ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-muted-foreground">Harga Weekend</p>
              <p className="text-2xl font-bold text-blue-600">
                Rp {pricing.weekend_price.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-sm text-muted-foreground">Harga Weekday</p>
              <p className="text-2xl font-bold text-amber-600">
                Rp {pricing.weekday_price.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ) : null}
      </Card>

      {/* Facilities Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Fasilitas Villa</h2>
          {!editingFacilities && (
            <Button onClick={() => setEditingFacilities(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Fasilitas
            </Button>
          )}
        </div>

        {editingFacilities && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Nama Fasilitas
              </label>
              <Input
                value={newFacility.name}
                onChange={(e) =>
                  setNewFacility({ ...newFacility, name: e.target.value })
                }
                placeholder="Contoh: Private Pool"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Deskripsi
              </label>
              <textarea
                value={newFacility.description}
                onChange={(e) =>
                  setNewFacility({
                    ...newFacility,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                rows={2}
                placeholder="Deskripsi fasilitas..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Kategori</label>
              <select
                value={newFacility.category}
                onChange={(e) =>
                  setNewFacility({ ...newFacility, category: e.target.value })
                }
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="general">General</option>
                <option value="amenity">Amenity</option>
                <option value="kitchen">Kitchen</option>
                <option value="entertainment">Entertainment</option>
                <option value="facility">Facility</option>
                <option value="view">View</option>
                <option value="location">Location</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Ikon</label>
              <div className="flex items-center gap-3">
                <select
                  value={newFacility.icon_name}
                  onChange={(e) =>
                    setNewFacility({
                      ...newFacility,
                      icon_name: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Pilih ikon (opsional)</option>
                  {iconOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="p-2 rounded bg-white border">
                  {newFacility.icon_name ? (
                    (() => {
                      const Icon = iconComponentMap[newFacility.icon_name];
                      return Icon ? (
                        <Icon className="w-5 h-5 text-sky-600" />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Preview
                        </span>
                      );
                    })()
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Preview
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addFacility} size="sm">
                Tambah
              </Button>
              <Button
                onClick={() => {
                  setEditingFacilities(false);
                  setNewFacility({
                    name: "",
                    description: "",
                    category: "general",
                    icon_name: "",
                  });
                }}
                variant="outline"
                size="sm"
              >
                Batal
              </Button>
            </div>
          </div>
        )}

        {editingFacilityId && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-3 border border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Edit Fasilitas</p>
                <p className="text-xs text-muted-foreground">
                  Ubah nama, deskripsi, atau kategori fasilitas.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingFacilityId(null)}
              >
                Batal
              </Button>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Nama Fasilitas
              </label>
              <Input
                value={editingFacilityForm.name}
                onChange={(e) =>
                  setEditingFacilityForm({
                    ...editingFacilityForm,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Deskripsi
              </label>
              <textarea
                value={editingFacilityForm.description}
                onChange={(e) =>
                  setEditingFacilityForm({
                    ...editingFacilityForm,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Kategori</label>
              <select
                value={editingFacilityForm.category}
                onChange={(e) =>
                  setEditingFacilityForm({
                    ...editingFacilityForm,
                    category: e.target.value,
                  })
                }
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="general">General</option>
                <option value="amenity">Amenity</option>
                <option value="kitchen">Kitchen</option>
                <option value="entertainment">Entertainment</option>
                <option value="facility">Facility</option>
                <option value="view">View</option>
                <option value="location">Location</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Ikon</label>
              <div className="flex items-center gap-3">
                <select
                  value={editingFacilityForm.icon_name}
                  onChange={(e) =>
                    setEditingFacilityForm({
                      ...editingFacilityForm,
                      icon_name: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Pilih ikon (opsional)</option>
                  {iconOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 p-2 rounded bg-white border">
                  <div className="w-10 h-10 flex items-center justify-center">
                    {editingFacilityForm.icon_name ? (
                      ((): any => {
                        const iconVal = editingFacilityForm.icon_name || "";
                        const isUrl = iconVal.startsWith("http");
                        if (isUrl)
                          return (
                            <img
                              src={iconVal}
                              alt="ikon"
                              className="w-8 h-8 object-contain"
                            />
                          );
                        const Icon = iconComponentMap[iconVal];
                        return Icon ? (
                          <Icon className="w-5 h-5 text-sky-600" />
                        ) : (
                          <Check className="w-5 h-5 text-sky-600" />
                        );
                      })()
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Preview
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col text-sm">
                    <label className="text-muted-foreground">
                      atau unggah gambar
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditIconFile}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={updateFacility} size="sm">
                Simpan Perubahan
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingFacilityId(null)}
              >
                Batal
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : facilities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Belum ada fasilitas. Tambahkan fasilitas baru.
          </p>
        ) : (
          <div className="space-y-2">
            {facilities.map((facility) => (
              <div
                key={facility.id_villa_facilities}
                className="flex items-start justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{facility.name}</p>
                  {facility.description && (
                    <p className="text-sm text-muted-foreground">
                      {facility.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Kategori: {facility.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditFacility(facility)}
                    className="ml-2 p-2 text-sky-600 hover:bg-sky-100 rounded-lg transition"
                    aria-label={`Edit fasilitas ${facility.name}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteFacility(facility.id_villa_facilities)}
                    className="ml-2 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
                    aria-label={`Hapus fasilitas ${facility.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PricingFacilitiesAdmin;
