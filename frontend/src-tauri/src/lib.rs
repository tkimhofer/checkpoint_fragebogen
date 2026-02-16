#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::OpenOptions;
use std::io::Write;
use std::path::Path;

#[tauri::command]
fn append_csv(path: &str, row: &str, header: Option<&str>) -> Result<(), String> {
    let path = Path::new(path);
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| format!("Dir error: {}", e))?;
    }

    let file_exists = path.exists();
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(path)
        .map_err(|e| format!("File error: {}", e))?;

    if !file_exists {
        if let Some(h) = header {
            writeln!(file, "{}", h).map_err(|e| format!("Write error: {}", e))?;
        }
    }

    for line in row.lines() {
        writeln!(file, "{}", line).map_err(|e| format!("Write error: {}", e))?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![append_csv])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
