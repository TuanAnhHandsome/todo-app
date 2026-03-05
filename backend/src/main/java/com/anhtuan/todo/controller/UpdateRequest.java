package com.anhtuan.todo.controller;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;

// ── Update request ───────────────────────────────────────────
public class UpdateRequest {

    @Size(max = 200)
    private String    text;
    private Boolean   completed;
    private String    priority;
    private LocalDate deadline;
    private String    listId;

    public String    getText()     { return text; }
    public Boolean   getCompleted(){ return completed; }
    public String    getPriority() { return priority; }
    public LocalDate getDeadline() { return deadline; }
    public String    getListId()   { return listId; }

    public void setText(String t)        { this.text = t; }
    public void setCompleted(Boolean c)  { this.completed = c; }
    public void setPriority(String p)    { this.priority = p; }
    public void setDeadline(LocalDate d) { this.deadline = d; }
    public void setListId(String l)      { this.listId = l; }
}
