"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, UserPlus, Trash2, Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Contact {
  _id: string
  name: string
  phone: string
  relationship: string
}

export function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState({ name: "", phone: "", relationship: "Family" })

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/emergency-contacts")
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch {
      console.error("Failed to fetch contacts")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) return

    try {
      const res = await fetch("/api/emergency-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setForm({ name: "", phone: "", relationship: "Family" })
        setIsAdding(false)
        fetchContacts()
      }
    } catch {
      console.error("Failed to add contact")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/emergency-contacts?id=${id}`, { method: "DELETE" })
      fetchContacts()
    } catch {
      console.error("Failed to delete contact")
    }
  }

  return (
    <Card className="glass group hover:glow transition-all duration-500">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Emergency Contacts
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          className="glass border-white/10 rounded-xl h-8 text-xs"
        >
          <UserPlus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAdd}
              className="space-y-3 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-secondary/50 border-white/5 rounded-xl h-9 text-sm"
                  required
                />
                <Input
                  placeholder="+1 234 567 8901"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-secondary/50 border-white/5 rounded-xl h-9 text-sm"
                  required
                />
                <Input
                  placeholder="Relationship"
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  className="bg-secondary/50 border-white/5 rounded-xl h-9 text-sm"
                />
              </div>
              <Button type="submit" size="sm" className="w-full rounded-xl h-9 bg-primary">
                Save Contact
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="py-6 text-center">
            <Phone className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">No emergency contacts yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact, i) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group/item hover:bg-white/10 transition-all"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{contact.name}</p>
                  <p className="text-[10px] text-muted-foreground">{contact.phone} · {contact.relationship}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(contact._id)}
                  className="h-8 w-8 opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-lg"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
