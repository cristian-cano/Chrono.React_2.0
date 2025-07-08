from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/dashboard')
def dashboard():
    return render_template('Admin/admin1.html')

@admin_bp.route('/add_employee', methods=['POST'])
def add_employee():
       return redirect(url_for('admin.dashboard'))
   

