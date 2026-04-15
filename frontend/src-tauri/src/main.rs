// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]



use tauri::command;
#[command]
fn get_hostname() -> String {
    match hostname::get() {
        Ok(name) => name.to_string_lossy().to_string(),
        Err(_) => "unknown".to_string(),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![get_hostname])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
