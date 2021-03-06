(require 'request)

(defconst temmet-buffer-name "*temmet*")
(defconst temmet-url "localhost:8000/temmet/%s")
(defconst temmet-response-wait-seconds 3)
(defconst temmet-point-flag
  (temmet--get-response "constants/cursor-flag"))
(setq temmet-status (cons 'offline nil))

(defun temmet--current-unix-time ()
  "Gets the current UNIX time.  Used for timeouts."
  (string-to-number (format-time-string "%s" (current-time))))

(defun temmet--make-request (request)
  (setq temmet-status
        (cons 'in-progress (temmet--current-unix-time)))
  (request
   (format temmet-url request)
   :parser #'buffer-string
   :success
   (lambda (&rest args)
     (setq temmet-status (cons 'success nil))
     (when-let ((data (plist-get args :data)))
       (setq temmet-status (cons 'success data))
       (with-current-buffer (get-buffer-create temmet-buffer-name)
         (erase-buffer)
         (insert data))))
   :error
   (lambda (&rest args)
     (setq temmet-status (cons 'unknown-error args)))
   :status-code '((400 . (lambda (&rest _) (setq temmet-status (cons 'http-error 400))))
                  (418 . (lambda (&rest _) (setq temmet-status (cons 'http-error 418)))))))

(defun temmet--wait-for-response (&optional sleeptime)
  (let ((ms (or sleeptime 10)))
    (sleep-for 0 ms)
    (while (eq (car temmet-status) 'in-progress)
      (let ((temmet-status-now temmet-status))
        (if (> (temmet--current-unix-time)
               (+ temmet-response-wait-seconds
                  (cdr temmet-status-now)))
            (error "Took too long!")
          (sleep-for 0 ms))))))

(defun temmet--get-response (request &optional polling-frequency)
  (temmet--make-request request)
  (temmet--wait-for-response)
  (temmet--expand-response temmet-status))

(defun temmet--expand-response (status)
  (cl-case (car temmet-status)
    ('success (cdr temmet-status))
    ('http-error
     (cl-case (cdr temmet-status)
       (400 (concat shorttext " "))
       (t (message "Unknown HTTP error %S" (cdr temmet-status))
          temmet-status)))
    (t temmet-status)))

(defun temmet-expand (shorttext)
  "Expand SHORTTEXT if possible."
  (temmet--get-response (concat "expand/" shorttext)))

(defun temmet--expandable-text-at-point (&optional begin end)
  (let ((end (or end (point)))
        (begin (or begin (save-excursion (search-backward-regexp (rx (or bol whitespace)))))))
    (buffer-substring-no-properties
     (if (char-equal ?  (char-after begin))
         (1+ begin)
       begin) end)))

(defun temmet-expand-at-point ()
  (interactive)
  (let* ((end (point))
         (begin (save-excursion (search-backward-regexp (rx (or bol whitespace)))))
         (shorttext (temmet--expandable-text-at-point begin end)))
    (let ((longtext (temmet-expand shorttext)))
      (if (not (stringp longtext))
          (insert ? )
        ;; TODO: What if the buffer is already narrowed?
        (narrow-to-region begin end)
        (delete-region (point-min) (point-max))
        (insert longtext)
        (when (search-backward temmet-point-flag nil t)
          (delete-char (length temmet-point-flag)))
        (widen)))))

(defun temmet--line-text ()
  (save-excursion
    (let* ((eol (progn (end-of-line) (point)))
           (bol (progn (beginning-of-line) (point))))
      (buffer-substring-no-properties bol eol))))

(defun temmet-point-is-expandable-p ()
  (string-match-p
   (rx (: bol (* (not (any " "))) eol))
   (temmet--line-text)))

(defun temmet--try-expand ()
  (message "%S" this-command)
  (save-excursion
    (backward-char)
    (when (temmet-point-is-expandable-p)
      (delete-char 1)
      (temmet-expand-at-point))))

(define-minor-mode temmet-mode
  "Toggle TemmeT-mode"
  nil " TemmeT" nil
  (if temmet-mode
      (if (eq major-mode 'typescript-mode)
          (temmet--enable)
        (user-error "Not allowed outside typescript-mode"))
    (temmet--disable)))

(defun temmet--enable ()
  (add-hook 'post-command-hook #'temmet--try-expand nil t))

(defun temmet--disable ()
  (remove-hook 'post-command-hook #'temmet--try-expand))

(defun temmet--dispatcher (&optional _))

(defun --trash (a)
  (interactive "P")
  (message "hello!")
  (insert "^"))

(define-key typescript-mode-map " "
  '(menu-item
    "temmet--maybe-expand-at-point" nil
    :filter (lambda (&optional _)
              (when (temmet-point-is-expandable-p)
                #'temmet-expand-at-point))))

;;; or use a hook on post-self-insert-hoo  
