"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  useAdminSettings,
  type AdminUser,
  type CustomerServiceSettings,
  type LiveSupportConversation,
  type WhatsAppSettings,
} from "@/components/providers/admin-settings-provider";
import { useGalleryAdmin } from "@/components/providers/gallery-admin-provider";
import {
  galleryCategories,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/site-data";

const NEW_ITEM_KEY = "__new__";
const NEW_USER_KEY = "__new-user__";

type AdminSection =
  | "products"
  | "users"
  | "customer-service"
  | "whatsapp";

function cloneItem(item: GalleryItem) {
  return {
    ...item,
    categories: [...item.categories],
  };
}

function cloneUser(user: AdminUser) {
  return {
    ...user,
  };
}

function emptyMessage(text: string) {
  return text.trim().length === 0;
}

export function GalleryAdminDashboard() {
  const {
    items,
    hydrated: galleryHydrated,
    saveItem,
    deleteItem,
    resetItems,
    createDraftItem,
  } = useGalleryAdmin();
  const {
    users,
    service,
    whatsapp,
    conversations,
    hydrated: settingsHydrated,
    saveUser,
    deleteUser,
    createDraftUser,
    saveService,
    saveWhatsApp,
    sendSupportReply,
    setConversationStatus,
  } = useAdminSettings();

  const [activeSection, setActiveSection] =
    useState<AdminSection>("products");

  const [search, setSearch] = useState("");
  const [selectedKey, setSelectedKey] = useState<string>(
    items[0]?.slug ?? NEW_ITEM_KEY,
  );
  const [draft, setDraft] = useState<GalleryItem>(
    items[0] ? cloneItem(items[0]) : createDraftItem(),
  );
  const [previousSlug, setPreviousSlug] = useState<string | undefined>(
    items[0]?.slug,
  );
  const [productNotice, setProductNotice] = useState("");
  const [productError, setProductError] = useState("");

  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>(
    users[0]?.id ?? NEW_USER_KEY,
  );
  const [userDraft, setUserDraft] = useState<AdminUser>(
    users[0] ? cloneUser(users[0]) : createDraftUser(),
  );
  const [userNotice, setUserNotice] = useState("");
  const [userError, setUserError] = useState("");

  const [serviceDraft, setServiceDraft] =
    useState<CustomerServiceSettings>(service);
  const [serviceNotice, setServiceNotice] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [serviceReplyDraft, setServiceReplyDraft] = useState("");

  const [whatsappDraft, setWhatsappDraft] =
    useState<WhatsAppSettings>(whatsapp);
  const [whatsappNotice, setWhatsappNotice] = useState("");
  const [whatsappError, setWhatsappError] = useState("");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) =>
      [item.title, item.slug, item.primaryCategory, ...item.categories].some(
        (value) => value.toLowerCase().includes(query),
      ),
    );
  }, [items, search]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.email, user.role, user.status].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [userSearch, users]);

  const stats = useMemo(() => {
    const liveService = service.liveEnabled ? "Live" : "Offline";

    return {
      total: items.length,
      users: users.length,
      serviceStatus: liveService,
      inbox: conversations.length,
    };
  }, [conversations.length, items.length, service.liveEnabled, users.length]);

  useEffect(() => {
    let nextDraft = createDraftItem();
    let nextKey = selectedKey;
    let nextPreviousSlug: string | undefined;

    if (selectedKey === NEW_ITEM_KEY) {
      return;
    }

    const selectedItem = items.find((item) => item.slug === selectedKey);

    if (selectedItem) {
      nextDraft = cloneItem(selectedItem);
      nextPreviousSlug = selectedItem.slug;
    } else if (items[0]) {
      nextKey = items[0].slug;
      nextDraft = cloneItem(items[0]);
      nextPreviousSlug = items[0].slug;
    } else {
      nextKey = NEW_ITEM_KEY;
      nextDraft = createDraftItem();
      nextPreviousSlug = undefined;
    }

    const timer = window.setTimeout(() => {
      setSelectedKey(nextKey);
      setDraft(nextDraft);
      setPreviousSlug(nextPreviousSlug);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [createDraftItem, items, selectedKey]);

  useEffect(() => {
    let nextDraft = createDraftUser();
    let nextUserId = selectedUserId;

    if (selectedUserId === NEW_USER_KEY) {
      return;
    }

    const selectedUser = users.find((user) => user.id === selectedUserId);

    if (selectedUser) {
      nextDraft = cloneUser(selectedUser);
    } else if (users[0]) {
      nextUserId = users[0].id;
      nextDraft = cloneUser(users[0]);
    } else {
      nextUserId = NEW_USER_KEY;
      nextDraft = createDraftUser();
    }

    const timer = window.setTimeout(() => {
      setSelectedUserId(nextUserId);
      setUserDraft(nextDraft);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [createDraftUser, selectedUserId, users]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setServiceDraft(service);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [service]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setWhatsappDraft(whatsapp);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [whatsapp]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (selectedConversationId) {
        const selectedConversation = conversations.find(
          (conversation) => conversation.id === selectedConversationId,
        );

        if (selectedConversation) {
          return;
        }
      }

      setSelectedConversationId(conversations[0]?.id ?? "");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [conversations, selectedConversationId]);

  function updateDraft<K extends keyof GalleryItem>(
    key: K,
    value: GalleryItem[K],
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function startNewItem() {
    const nextDraft = createDraftItem();
    setSelectedKey(NEW_ITEM_KEY);
    setDraft(nextDraft);
    setPreviousSlug(undefined);
    setProductError("");
    setProductNotice("Ready to add a new product.");
  }

  function editItem(item: GalleryItem) {
    setSelectedKey(item.slug);
    setDraft(cloneItem(item));
    setPreviousSlug(item.slug);
    setProductError("");
    setProductNotice("");
  }

  function toggleCategory(category: GalleryCategory) {
    setDraft((current) => {
      const exists = current.categories.includes(category);
      const categories = exists
        ? current.categories.filter((entry) => entry !== category)
        : [...current.categories, category];

      const normalizedCategories = categories.includes(current.primaryCategory)
        ? categories
        : [current.primaryCategory, ...categories];

      return {
        ...current,
        categories: normalizedCategories,
      };
    });
  }

  function changePrimaryCategory(category: GalleryCategory) {
    setDraft((current) => ({
      ...current,
      primaryCategory: category,
      categories: current.categories.includes(category)
        ? current.categories
        : [category, ...current.categories],
    }));
  }

  function handleSaveProduct() {
    if (emptyMessage(draft.title)) {
      setProductError("Title is required.");
      return;
    }

    if (emptyMessage(draft.slug)) {
      setProductError("Slug is required.");
      return;
    }

    if (emptyMessage(draft.image)) {
      setProductError("Image URL is required.");
      return;
    }

    if (emptyMessage(draft.alt)) {
      setProductError("Alt text is required.");
      return;
    }

    if (emptyMessage(draft.sourceLabel)) {
      setProductError("Source label is required.");
      return;
    }

    const nextSlug = saveItem(
      {
        ...draft,
        categories: Array.from(
          new Set([draft.primaryCategory, ...draft.categories]),
        ),
      },
      previousSlug,
    );

    setSelectedKey(nextSlug);
    setPreviousSlug(nextSlug);
    setDraft((current) => ({
      ...current,
      slug: nextSlug,
      categories: Array.from(
        new Set([current.primaryCategory, ...current.categories]),
      ),
    }));
    setProductError("");
    setProductNotice("Product saved successfully.");
  }

  function handleDeleteProduct() {
    if (!previousSlug) {
      setProductError("Save the product before deleting it.");
      return;
    }

    const confirmed = window.confirm("Delete this product from admin?");

    if (!confirmed) {
      return;
    }

    deleteItem(previousSlug);
    const nextItem = items.find((item) => item.slug !== previousSlug);

    if (nextItem) {
      setSelectedKey(nextItem.slug);
      setDraft(cloneItem(nextItem));
      setPreviousSlug(nextItem.slug);
    } else {
      const nextDraft = createDraftItem();
      setSelectedKey(NEW_ITEM_KEY);
      setDraft(nextDraft);
      setPreviousSlug(undefined);
    }

    setProductError("");
    setProductNotice("Product deleted.");
  }

  function handleResetProducts() {
    const confirmed = window.confirm("Reset all products back to defaults?");

    if (!confirmed) {
      return;
    }

    resetItems();
    setProductError("");
    setProductNotice("Products reset to default.");
  }

  function startNewUser() {
    const nextUser = createDraftUser();
    setSelectedUserId(NEW_USER_KEY);
    setUserDraft(nextUser);
    setUserNotice("Ready to add a new user.");
    setUserError("");
  }

  function editUser(user: AdminUser) {
    setSelectedUserId(user.id);
    setUserDraft(cloneUser(user));
    setUserNotice("");
    setUserError("");
  }

  function handleSaveUser() {
    if (emptyMessage(userDraft.name)) {
      setUserError("User name is required.");
      return;
    }

    if (
      emptyMessage(userDraft.email) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDraft.email)
    ) {
      setUserError("Enter a valid email address.");
      return;
    }

    saveUser(userDraft);
    setSelectedUserId(userDraft.id);
    setUserError("");
    setUserNotice("User saved successfully.");
  }

  function handleDeleteUser() {
    if (selectedUserId === NEW_USER_KEY) {
      setUserError("Select a saved user before deleting.");
      return;
    }

    const confirmed = window.confirm("Delete this user from admin?");

    if (!confirmed) {
      return;
    }

    deleteUser(selectedUserId);
    const nextUser = users.find((user) => user.id !== selectedUserId);

    if (nextUser) {
      setSelectedUserId(nextUser.id);
      setUserDraft(cloneUser(nextUser));
    } else {
      const nextDraft = createDraftUser();
      setSelectedUserId(NEW_USER_KEY);
      setUserDraft(nextDraft);
    }

    setUserError("");
    setUserNotice("User deleted.");
  }

  function handleSaveService() {
    saveService(serviceDraft);
    setServiceNotice("Customer service live settings saved.");
  }

  function handleSendSupportReply() {
    if (!selectedConversationId) {
      setServiceNotice("Select a customer conversation first.");
      return;
    }

    const sent = sendSupportReply(selectedConversationId, serviceReplyDraft);

    if (!sent) {
      setServiceNotice("Write a reply before sending it.");
      return;
    }

    setServiceReplyDraft("");
    setServiceNotice("Reply sent to the live customer service thread.");
  }

  function handleConversationStatus(status: LiveSupportConversation["status"]) {
    if (!selectedConversationId) {
      setServiceNotice("Select a customer conversation first.");
      return;
    }

    setConversationStatus(selectedConversationId, status);
    setServiceNotice(
      status === "closed"
        ? "Conversation marked as closed."
        : "Conversation marked as open.",
    );
  }

  function handleSaveWhatsApp() {
    if (emptyMessage(whatsappDraft.number)) {
      setWhatsappError("WhatsApp number is required.");
      return;
    }

    if (emptyMessage(whatsappDraft.buttonText)) {
      setWhatsappError("Button text is required.");
      return;
    }

    saveWhatsApp(whatsappDraft);
    setWhatsappError("");
    setWhatsappNotice("WhatsApp customer settings saved.");
  }

  const currentSection = getSectionDetails(activeSection);

  return (
    <div className="min-h-screen bg-[#ffffff] text-[var(--color-ivory)]">
      <div className="mx-auto grid w-full max-w-[1700px] gap-6 px-5 py-8 sm:px-8 xl:grid-cols-[280px_1fr] xl:px-10">
        <aside className="h-fit space-y-6 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-5 xl:sticky xl:top-24">
          <div className="space-y-3 border-b border-[rgba(46,16,101,0.08)] pb-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Admin Sidebar
            </p>
            <h1 className="font-serif text-3xl tracking-[0.08em] text-[var(--color-ivory)]">
              MIAN TAILOR
            </h1>
            <p className="text-sm tracking-[0.18em] text-[rgba(46,16,101,0.58)]">
              and design
            </p>
          </div>

          <nav className="space-y-3">
            <SidebarButton
              label="Products"
              meta={`${items.length} items`}
              active={activeSection === "products"}
              onClick={() => setActiveSection("products")}
            />
            <SidebarButton
              label="Users"
              meta={`${users.length} accounts`}
              active={activeSection === "users"}
              onClick={() => setActiveSection("users")}
            />
            <SidebarButton
              label="Customer Service Live"
              meta={service.liveEnabled ? "Live" : "Offline"}
              active={activeSection === "customer-service"}
              onClick={() => setActiveSection("customer-service")}
            />
            <SidebarButton
              label="WhatsApp Customer"
              meta={whatsapp.enabled ? "Enabled" : "Disabled"}
              active={activeSection === "whatsapp"}
              onClick={() => setActiveSection("whatsapp")}
            />
          </nav>

          <div className="grid gap-3 border-t border-[rgba(46,16,101,0.08)] pt-5">
            <StatCard label="Products" value={String(stats.total)} />
            <StatCard label="Users" value={String(stats.users)} />
            <StatCard label="Service" value={stats.serviceStatus} />
          </div>

          <div className="space-y-3 border-t border-[rgba(46,16,101,0.08)] pt-5">
            <Link href="/gallery" className="luxe-button-secondary justify-center">
              View Public Gallery
            </Link>
            <Link href="/contact" className="luxe-button-secondary justify-center">
              View Contact Page
            </Link>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="grid gap-6 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <span className="eyebrow">{currentSection.eyebrow}</span>
              <h2 className="font-serif text-4xl leading-none tracking-[0.08em] text-[var(--color-ivory)] sm:text-5xl">
                {currentSection.title}
              </h2>
              <p className="max-w-3xl text-base leading-8 text-[rgba(46,16,101,0.68)]">
                {currentSection.description}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Products" value={String(items.length)} />
              <StatCard label="Users" value={String(users.length)} />
              <StatCard
                label="Inbox"
                value={String(stats.inbox)}
              />
            </div>
          </section>

          {activeSection === "products" ? (
            <ProductsSection
              hydrated={galleryHydrated}
              search={search}
              setSearch={setSearch}
              filteredItems={filteredItems}
              selectedKey={selectedKey}
              draft={draft}
              productNotice={productNotice}
              productError={productError}
              onStartNew={startNewItem}
              onEditItem={editItem}
              onUpdateDraft={updateDraft}
              onToggleCategory={toggleCategory}
              onChangePrimaryCategory={changePrimaryCategory}
              onSave={handleSaveProduct}
              onDelete={handleDeleteProduct}
              onReset={handleResetProducts}
            />
          ) : null}

          {activeSection === "users" ? (
            <UsersSection
              hydrated={settingsHydrated}
              users={filteredUsers}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              selectedUserId={selectedUserId}
              userDraft={userDraft}
              userNotice={userNotice}
              userError={userError}
              onStartNew={startNewUser}
              onEditUser={editUser}
              onSetDraft={setUserDraft}
              onSave={handleSaveUser}
              onDelete={handleDeleteUser}
            />
          ) : null}

          {activeSection === "customer-service" ? (
            <CustomerServiceSection
              hydrated={settingsHydrated}
              draft={serviceDraft}
              notice={serviceNotice}
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              replyDraft={serviceReplyDraft}
              onChange={setServiceDraft}
              onSelectConversation={setSelectedConversationId}
              onReplyDraftChange={setServiceReplyDraft}
              onSendReply={handleSendSupportReply}
              onUpdateStatus={handleConversationStatus}
              onSave={handleSaveService}
            />
          ) : null}

          {activeSection === "whatsapp" ? (
            <WhatsAppSection
              hydrated={settingsHydrated}
              draft={whatsappDraft}
              notice={whatsappNotice}
              error={whatsappError}
              onChange={setWhatsappDraft}
              onSave={handleSaveWhatsApp}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

function ProductsSection({
  hydrated,
  search,
  setSearch,
  filteredItems,
  selectedKey,
  draft,
  productNotice,
  productError,
  onStartNew,
  onEditItem,
  onUpdateDraft,
  onToggleCategory,
  onChangePrimaryCategory,
  onSave,
  onDelete,
  onReset,
}: {
  hydrated: boolean;
  search: string;
  setSearch: (value: string) => void;
  filteredItems: GalleryItem[];
  selectedKey: string;
  draft: GalleryItem;
  productNotice: string;
  productError: string;
  onStartNew: () => void;
  onEditItem: (item: GalleryItem) => void;
  onUpdateDraft: <K extends keyof GalleryItem>(
    key: K,
    value: GalleryItem[K],
  ) => void;
  onToggleCategory: (category: GalleryCategory) => void;
  onChangePrimaryCategory: (category: GalleryCategory) => void;
  onSave: () => void;
  onDelete: () => void;
  onReset: () => void;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <aside className="space-y-5 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Product Library
            </p>
            <p className="mt-2 text-sm leading-7 text-[rgba(46,16,101,0.6)]">
              Choose a product to edit or add a new one.
            </p>
          </div>
          <button type="button" onClick={onStartNew} className="luxe-button">
            Add New
          </button>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search product title, slug, category..."
          className="field"
        />

        <div className="space-y-3">
          {filteredItems.map((item) => {
            const active = selectedKey === item.slug;

            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => onEditItem(item)}
                className={`w-full border px-4 py-4 text-left transition ${
                  active
                    ? "border-[var(--color-gold)] bg-[rgba(124,58,237,0.1)]"
                    : "border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] hover:border-[rgba(124,58,237,0.35)]"
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  {item.primaryCategory}
                </p>
                <p className="mt-2 font-serif text-2xl tracking-[0.05em] text-[var(--color-ivory)]">
                  {item.title}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[rgba(46,16,101,0.45)]">
                  {item.slug}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-5 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                {selectedKey === NEW_ITEM_KEY ? "New Product" : "Edit Product"}
              </p>
              <p className="mt-2 text-sm leading-7 text-[rgba(46,16,101,0.62)]">
                Update product titles, image URLs, categories, prices, and source labels.
              </p>
            </div>
            <button type="button" onClick={onReset} className="luxe-button-secondary">
              Reset Defaults
            </button>
          </div>

          {productNotice ? (
            <div className="border border-[rgba(124,58,237,0.28)] bg-[rgba(124,58,237,0.08)] px-4 py-3 text-sm text-[rgba(46,16,101,0.82)]">
              {productNotice}
            </div>
          ) : null}

          {productError ? (
            <div className="border border-[rgba(217,182,177,0.28)] bg-[rgba(217,182,177,0.08)] px-4 py-3 text-sm text-[#e8cac6]">
              {productError}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="form-label">Title</span>
              <input
                value={draft.title}
                onChange={(event) => onUpdateDraft("title", event.target.value)}
                className="field"
              />
            </label>

            <label className="space-y-2">
              <span className="form-label">Slug</span>
              <input
                value={draft.slug}
                onChange={(event) => onUpdateDraft("slug", event.target.value)}
                className="field"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="form-label">Image URL</span>
              <input
                value={draft.image}
                onChange={(event) => onUpdateDraft("image", event.target.value)}
                className="field"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="form-label">Alt Text</span>
              <textarea
                value={draft.alt}
                onChange={(event) => onUpdateDraft("alt", event.target.value)}
                className="field min-h-[110px] resize-y"
              />
            </label>

            <label className="space-y-2">
              <span className="form-label">Price Label</span>
              <input
                value={draft.priceLabel ?? ""}
                onChange={(event) => onUpdateDraft("priceLabel", event.target.value)}
                className="field"
                placeholder="PKR 18,500"
              />
            </label>

            <label className="space-y-2">
              <span className="form-label">Source Label</span>
              <input
                value={draft.sourceLabel}
                onChange={(event) => onUpdateDraft("sourceLabel", event.target.value)}
                className="field"
              />
            </label>

            <label className="space-y-2">
              <span className="form-label">Primary Category</span>
              <select
                value={draft.primaryCategory}
                onChange={(event) =>
                  onChangePrimaryCategory(event.target.value as GalleryCategory)
                }
                className="field"
              >
                {galleryCategories.map((category) => (
                  <option key={category} value={category} className="bg-[#ffffff]">
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-3">
            <span className="form-label">Assigned Categories</span>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {galleryCategories.map((category) => {
                const active = draft.categories.includes(category);

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => onToggleCategory(category)}
                    className={`border px-4 py-3 text-left text-sm leading-6 transition ${
                      active
                        ? "border-[var(--color-gold)] bg-[rgba(124,58,237,0.12)] text-[var(--color-ivory)]"
                        : "border-[rgba(46,16,101,0.1)] text-[rgba(46,16,101,0.6)] hover:border-[rgba(124,58,237,0.35)]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-[rgba(46,16,101,0.08)] pt-5">
            <button type="button" onClick={onSave} className="luxe-button">
              Save Product
            </button>
            <button type="button" onClick={onDelete} className="luxe-button-secondary">
              Delete Product
            </button>
          </div>
        </section>

        <aside className="space-y-5 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
            Product Preview
          </p>

          <div className="overflow-hidden border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)]">
            {draft.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={draft.image}
                alt={draft.alt || draft.title || "Product preview"}
                className="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center bg-[#f8f4ff] px-6 text-center text-sm leading-7 text-[rgba(46,16,101,0.46)]">
                Add an image URL to preview the product.
              </div>
            )}

            <div className="space-y-4 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
                {draft.primaryCategory}
              </p>
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif text-3xl tracking-[0.06em] text-[var(--color-ivory)]">
                  {draft.title || "Untitled Product"}
                </h2>
                {draft.priceLabel ? (
                  <span className="text-xs uppercase tracking-[0.16em] text-[rgba(46,16,101,0.58)]">
                    {draft.priceLabel}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {draft.categories.map((category) => (
                  <span
                    key={category}
                    className="border border-[rgba(46,16,101,0.12)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[rgba(46,16,101,0.55)]"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <p className="text-xs leading-6 text-[rgba(46,16,101,0.45)]">
                {draft.sourceLabel || "Source label"}
              </p>
            </div>
          </div>

          <div className="border border-[rgba(46,16,101,0.1)] px-4 py-4 text-sm leading-7 text-[rgba(46,16,101,0.64)]">
            {hydrated
              ? "Public gallery products update from this managed list."
              : "Loading saved products..."}
          </div>
        </aside>
      </div>
    </section>
  );
}

function UsersSection({
  hydrated,
  users,
  userSearch,
  setUserSearch,
  selectedUserId,
  userDraft,
  userNotice,
  userError,
  onStartNew,
  onEditUser,
  onSetDraft,
  onSave,
  onDelete,
}: {
  hydrated: boolean;
  users: AdminUser[];
  userSearch: string;
  setUserSearch: (value: string) => void;
  selectedUserId: string;
  userDraft: AdminUser;
  userNotice: string;
  userError: string;
  onStartNew: () => void;
  onEditUser: (user: AdminUser) => void;
  onSetDraft: (value: React.SetStateAction<AdminUser>) => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
      <aside className="space-y-5 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Users
            </p>
            <p className="mt-2 text-sm leading-7 text-[rgba(46,16,101,0.6)]">
              Manage admin accounts and support staff.
            </p>
          </div>
          <button type="button" onClick={onStartNew} className="luxe-button">
            Add User
          </button>
        </div>

        <input
          value={userSearch}
          onChange={(event) => setUserSearch(event.target.value)}
          placeholder="Search name, email, role..."
          className="field"
        />

        <div className="space-y-3">
          {users.map((user) => {
            const active = selectedUserId === user.id;

            return (
              <button
                key={user.id}
                type="button"
                onClick={() => onEditUser(user)}
                className={`w-full border px-4 py-4 text-left transition ${
                  active
                    ? "border-[var(--color-gold)] bg-[rgba(124,58,237,0.1)]"
                    : "border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] hover:border-[rgba(124,58,237,0.35)]"
                }`}
              >
                <p className="font-serif text-2xl tracking-[0.05em] text-[var(--color-ivory)]">
                  {user.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-[rgba(46,16,101,0.62)]">
                  {user.email}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-gold)]">
                  {user.role} · {user.status}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="space-y-5 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-5 sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
            User Details
          </p>
          <p className="mt-2 text-sm leading-7 text-[rgba(46,16,101,0.62)]">
            Add new admin users or update role and status for existing users.
          </p>
        </div>

        {userNotice ? (
          <div className="border border-[rgba(124,58,237,0.28)] bg-[rgba(124,58,237,0.08)] px-4 py-3 text-sm text-[rgba(46,16,101,0.82)]">
            {userNotice}
          </div>
        ) : null}

        {userError ? (
          <div className="border border-[rgba(217,182,177,0.28)] bg-[rgba(217,182,177,0.08)] px-4 py-3 text-sm text-[#e8cac6]">
            {userError}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="form-label">Full Name</span>
            <input
              value={userDraft.name}
              onChange={(event) =>
                onSetDraft((current) => ({ ...current, name: event.target.value }))
              }
              className="field"
            />
          </label>

          <label className="space-y-2">
            <span className="form-label">Email</span>
            <input
              value={userDraft.email}
              onChange={(event) =>
                onSetDraft((current) => ({ ...current, email: event.target.value }))
              }
              className="field"
            />
          </label>

          <label className="space-y-2">
            <span className="form-label">Role</span>
            <select
              value={userDraft.role}
              onChange={(event) =>
                onSetDraft((current) => ({
                  ...current,
                  role: event.target.value as AdminUser["role"],
                }))
              }
              className="field"
            >
              {["Administrator", "Editor", "Support"].map((role) => (
                <option key={role} value={role} className="bg-[#ffffff]">
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="form-label">Status</span>
            <select
              value={userDraft.status}
              onChange={(event) =>
                onSetDraft((current) => ({
                  ...current,
                  status: event.target.value as AdminUser["status"],
                }))
              }
              className="field"
            >
              {["Active", "Invited", "Offline"].map((status) => (
                <option key={status} value={status} className="bg-[#ffffff]">
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-[rgba(46,16,101,0.08)] pt-5">
          <button type="button" onClick={onSave} className="luxe-button">
            Save User
          </button>
          <button type="button" onClick={onDelete} className="luxe-button-secondary">
            Delete User
          </button>
        </div>

        <div className="border border-[rgba(46,16,101,0.1)] px-4 py-4 text-sm leading-7 text-[rgba(46,16,101,0.64)]">
          {hydrated
            ? "User settings are saved in this browser for the admin workspace."
            : "Loading user accounts..."}
        </div>
      </section>
    </section>
  );
}

function CustomerServiceSection({
  hydrated,
  draft,
  notice,
  conversations,
  selectedConversationId,
  replyDraft,
  onChange,
  onSelectConversation,
  onReplyDraftChange,
  onSendReply,
  onUpdateStatus,
  onSave,
}: {
  hydrated: boolean;
  draft: CustomerServiceSettings;
  notice: string;
  conversations: LiveSupportConversation[];
  selectedConversationId: string;
  replyDraft: string;
  onChange: (value: CustomerServiceSettings) => void;
  onSelectConversation: (value: string) => void;
  onReplyDraftChange: (value: string) => void;
  onSendReply: () => void;
  onUpdateStatus: (status: LiveSupportConversation["status"]) => void;
  onSave: () => void;
}) {
  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ??
    null;
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messagesRef.current || !selectedConversation) {
      return;
    }

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [selectedConversation, selectedConversation?.messages.length]);

  return (
    <section className="space-y-6">
      <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-5 sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Customer Service Live Settings
            </p>
            <p className="mt-2 text-sm leading-7 text-[rgba(46,16,101,0.62)]">
              Control the live customer service widget, contact page panel, and admin inbox.
            </p>
          </div>

          {notice ? (
            <div className="border border-[rgba(124,58,237,0.28)] bg-[rgba(124,58,237,0.08)] px-4 py-3 text-sm text-[rgba(46,16,101,0.82)]">
              {notice}
            </div>
          ) : null}

          <label className="flex items-center gap-3 border border-[rgba(46,16,101,0.1)] px-4 py-4">
            <input
              type="checkbox"
              checked={draft.liveEnabled}
              onChange={(event) =>
                onChange({ ...draft, liveEnabled: event.target.checked })
              }
            />
            <span className="text-sm uppercase tracking-[0.18em] text-[var(--color-ivory)]">
              Live customer service enabled
            </span>
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="form-label">Support Headline</span>
              <input
                value={draft.supportHeadline}
                onChange={(event) =>
                  onChange({ ...draft, supportHeadline: event.target.value })
                }
                className="field"
              />
            </label>

            <label className="space-y-2">
              <span className="form-label">Support Status</span>
              <input
                value={draft.supportStatus}
                onChange={(event) =>
                  onChange({ ...draft, supportStatus: event.target.value })
                }
                className="field"
              />
            </label>

            <label className="space-y-2">
              <span className="form-label">Assistant Name</span>
              <input
                value={draft.assistantName}
                onChange={(event) =>
                  onChange({ ...draft, assistantName: event.target.value })
                }
                className="field"
              />
            </label>

            <label className="space-y-2">
              <span className="form-label">Support Hours</span>
              <input
                value={draft.supportHours}
                onChange={(event) =>
                  onChange({ ...draft, supportHours: event.target.value })
                }
                className="field"
              />
            </label>

            <label className="space-y-2">
              <span className="form-label">Response Time</span>
              <input
                value={draft.responseTime}
                onChange={(event) =>
                  onChange({ ...draft, responseTime: event.target.value })
                }
                className="field"
              />
            </label>
          </div>

          <button type="button" onClick={onSave} className="luxe-button">
            Save Customer Service
          </button>
        </section>

        <aside className="space-y-5 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
            Live Preview
          </p>
          <div className="space-y-3 border border-[rgba(46,16,101,0.1)] p-5 text-sm leading-7 text-[rgba(46,16,101,0.68)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-gold)]">
              Customer Service Live
            </p>
            <p className="text-[var(--color-ivory)]">{draft.supportHeadline}</p>
            <p>{draft.liveEnabled ? draft.supportStatus : "Offline"}</p>
            <p>{draft.supportHours}</p>
            <p>{draft.responseTime}</p>
            <p>{draft.assistantName}</p>
          </div>
          <div className="border border-[rgba(46,16,101,0.1)] px-4 py-4 text-sm leading-7 text-[rgba(46,16,101,0.64)]">
            {hydrated
              ? "These customer service values are shown on the public frontend and live widget."
              : "Loading customer service settings..."}
          </div>
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-5 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-5 sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Live Inbox
            </p>
            <p className="mt-2 text-sm leading-7 text-[rgba(46,16,101,0.6)]">
              Open customer messages sent from the contact page and live widget.
            </p>
          </div>

          <div className="space-y-3">
            {conversations.length ? (
              conversations.map((conversation) => {
                const active = conversation.id === selectedConversationId;
                const lastMessage =
                  conversation.messages[conversation.messages.length - 1];

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`w-full border px-4 py-4 text-left transition ${
                      active
                        ? "border-[var(--color-gold)] bg-[rgba(124,58,237,0.1)]"
                        : "border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] hover:border-[rgba(124,58,237,0.35)]"
                    }`}
                  >
                    <p className="font-serif text-2xl tracking-[0.05em] text-[var(--color-ivory)]">
                      {conversation.customerName}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[rgba(46,16,101,0.62)]">
                      {conversation.customerEmail}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[rgba(46,16,101,0.56)]">
                      {lastMessage?.text ?? "No messages yet."}
                    </p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
                      {conversation.status} · {formatDateTime(conversation.updatedAt)}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="border border-[rgba(46,16,101,0.1)] px-4 py-4 text-sm leading-7 text-[rgba(46,16,101,0.62)]">
                No customer service messages yet.
              </div>
            )}
          </div>
        </aside>

        <section className="flex min-h-[720px] flex-col overflow-hidden border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)]">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[rgba(46,16,101,0.08)] px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                Conversation
              </p>
              <p className="mt-2 text-sm leading-7 text-[rgba(46,16,101,0.62)]">
                Reply to customer messages directly from admin.
              </p>
            </div>
            {selectedConversation ? (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateStatus("open")}
                  className="luxe-button-secondary"
                >
                  Mark Open
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStatus("closed")}
                  className="luxe-button-secondary"
                >
                  Mark Closed
                </button>
              </div>
            ) : null}
          </div>

          {selectedConversation ? (
            <>
              <div className="grid gap-4 border-b border-[rgba(46,16,101,0.08)] px-5 py-4 sm:grid-cols-3 sm:px-6">
                <div>
                  <p className="form-label">Customer</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-ivory)]">
                    {selectedConversation.customerName}
                  </p>
                </div>
                <div>
                  <p className="form-label">Email</p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(46,16,101,0.68)]">
                    {selectedConversation.customerEmail}
                  </p>
                </div>
                <div>
                  <p className="form-label">Status</p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(46,16,101,0.68)]">
                    {selectedConversation.status}
                  </p>
                </div>
              </div>

              <div
                ref={messagesRef}
                className="flex-1 space-y-4 overflow-y-auto bg-[#ffffff] px-5 py-5 sm:px-6"
              >
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`border px-4 py-3 ${
                      message.sender === "support"
                        ? "border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.08)]"
                        : "border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.03)]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
                        {message.sender === "support"
                          ? `${message.authorName} · Support`
                          : `${message.authorName} · Customer`}
                      </p>
                      <p className="text-xs text-[rgba(46,16,101,0.45)]">
                        {formatDateTime(message.createdAt)}
                      </p>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[rgba(46,16,101,0.72)]">
                      {message.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-[rgba(46,16,101,0.08)] bg-[rgba(248,244,255,0.94)] px-5 py-5 sm:px-6">
                <label className="space-y-2">
                  <span className="form-label">Reply Message</span>
                  <textarea
                    value={replyDraft}
                    onChange={(event) => onReplyDraftChange(event.target.value)}
                    className="field min-h-[140px] resize-y"
                    placeholder="Write a support reply..."
                  />
                </label>
                <button type="button" onClick={onSendReply} className="luxe-button">
                  Send Reply
                </button>
              </div>
            </>
          ) : (
            <div className="px-5 py-5 text-sm leading-7 text-[rgba(46,16,101,0.62)] sm:px-6">
              Select a conversation from the live inbox to read messages and reply.
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function WhatsAppSection({
  hydrated,
  draft,
  notice,
  error,
  onChange,
  onSave,
}: {
  hydrated: boolean;
  draft: WhatsAppSettings;
  notice: string;
  error: string;
  onChange: (value: WhatsAppSettings) => void;
  onSave: () => void;
}) {
  const whatsappHref = `https://wa.me/${draft.number.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    draft.defaultMessage,
  )}`;

  return (
    <section className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-5 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-5 sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
            WhatsApp Customer Settings
          </p>
          <p className="mt-2 text-sm leading-7 text-[rgba(46,16,101,0.62)]">
            Edit the live WhatsApp customer number, label, default message, and button text.
          </p>
        </div>

        {notice ? (
          <div className="border border-[rgba(124,58,237,0.28)] bg-[rgba(124,58,237,0.08)] px-4 py-3 text-sm text-[rgba(46,16,101,0.82)]">
            {notice}
          </div>
        ) : null}

        {error ? (
          <div className="border border-[rgba(217,182,177,0.28)] bg-[rgba(217,182,177,0.08)] px-4 py-3 text-sm text-[#e8cac6]">
            {error}
          </div>
        ) : null}

        <label className="flex items-center gap-3 border border-[rgba(46,16,101,0.1)] px-4 py-4">
          <input
            type="checkbox"
            checked={draft.enabled}
            onChange={(event) =>
              onChange({ ...draft, enabled: event.target.checked })
            }
          />
          <span className="text-sm uppercase tracking-[0.18em] text-[var(--color-ivory)]">
            WhatsApp customer enabled
          </span>
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="form-label">Label</span>
            <input
              value={draft.label}
              onChange={(event) =>
                onChange({ ...draft, label: event.target.value })
              }
              className="field"
            />
          </label>

          <label className="space-y-2">
            <span className="form-label">WhatsApp Number</span>
            <input
              value={draft.number}
              onChange={(event) =>
                onChange({ ...draft, number: event.target.value })
              }
              className="field"
            />
          </label>

          <label className="space-y-2">
            <span className="form-label">Button Text</span>
            <input
              value={draft.buttonText}
              onChange={(event) =>
                onChange({ ...draft, buttonText: event.target.value })
              }
              className="field"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="form-label">Default Message</span>
            <textarea
              value={draft.defaultMessage}
              onChange={(event) =>
                onChange({ ...draft, defaultMessage: event.target.value })
              }
              className="field min-h-[110px] resize-y"
            />
          </label>
        </div>

        <button type="button" onClick={onSave} className="luxe-button">
          Save WhatsApp Customer
        </button>
      </section>

      <aside className="space-y-5 border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
          WhatsApp Preview
        </p>
        <div className="space-y-3 border border-[rgba(46,16,101,0.1)] p-5 text-sm leading-7 text-[rgba(46,16,101,0.68)]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-gold)]">
            WhatsApp Customer
          </p>
          <p>{draft.label}</p>
          <p>{draft.number}</p>
          <p>{draft.defaultMessage}</p>
          {draft.enabled ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="luxe-button mt-2 justify-center"
            >
              {draft.buttonText}
            </a>
          ) : (
            <p className="text-[rgba(46,16,101,0.45)]">
              WhatsApp button is disabled.
            </p>
          )}
        </div>
        <div className="border border-[rgba(46,16,101,0.1)] px-4 py-4 text-sm leading-7 text-[rgba(46,16,101,0.64)]">
          {hydrated
            ? "The contact page reads these WhatsApp values directly from admin."
            : "Loading WhatsApp settings..."}
        </div>
      </aside>
    </section>
  );
}

function SidebarButton({
  label,
  meta,
  active,
  onClick,
}: {
  label: string;
  meta: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border px-4 py-4 text-left transition ${
        active
          ? "border-[var(--color-gold)] bg-[rgba(124,58,237,0.12)]"
          : "border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] hover:border-[rgba(124,58,237,0.35)]"
      }`}
    >
      <p className="font-serif text-2xl tracking-[0.05em] text-[var(--color-ivory)]">
        {label}
      </p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[rgba(46,16,101,0.48)]">
        {meta}
      </p>
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[rgba(46,16,101,0.1)] bg-[rgba(124,58,237,0.04)] p-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-gold)]">
        {label}
      </p>
      <p className="mt-4 font-serif text-4xl leading-none tracking-[0.08em] text-[var(--color-ivory)]">
        {value}
      </p>
    </div>
  );
}

function formatDateTime(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getSectionDetails(section: AdminSection) {
  if (section === "users") {
    return {
      eyebrow: "Users",
      title: "Manage admin users and support team access.",
      description:
        "Select the Users page from the sidebar to add or edit administrator, editor, and support accounts in one place.",
    };
  }

  if (section === "customer-service") {
    return {
      eyebrow: "Customer Service Live",
      title: "Control live customer service content from the sidebar.",
      description:
        "Update service status, response times, support hours, and assistant details, then manage incoming customer messages from the admin inbox.",
    };
  }

  if (section === "whatsapp") {
    return {
      eyebrow: "WhatsApp Customer",
      title: "Edit the live WhatsApp customer contact details.",
      description:
        "Change the WhatsApp number, button text, and default enquiry message from the admin panel and show it on the contact page.",
    };
  }

  return {
    eyebrow: "Products",
    title: "Select Products from the sidebar to manage gallery items.",
    description:
      "Edit existing products, add new gallery items, and control the public Shalwar Kameez product display from one professional admin workspace.",
  };
}

